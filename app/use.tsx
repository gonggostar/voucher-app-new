import { Camera, CameraView } from 'expo-camera';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react'; // 👈 useRef 추가
import { Alert, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SERVER_URL } from './config';
import { getUserId } from './session';

export default function UseVoucher() {
  const router = useRouter();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [manualSerial, setManualSerial] = useState('');
  
  // 🛑 초고속 브레이크 (화면 갱신과 상관없이 즉시 작동)
  const lockScan = useRef(false); 

  useEffect(() => {
    const getCameraPermissions = async () => {
      if (Platform.OS === 'web') {
        setHasPermission(true);
        return;
      }
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };
    getCameraPermissions();
  }, []);

  // 화면 들어올 때마다 브레이크 풀기
  useEffect(() => {
    lockScan.current = false;
    setScanned(false);
  }, []);

  const processPayment = async (serial: string) => {
    const ownerId = getUserId();
    
    if (!ownerId) {
      Alert.alert("오류", "로그인 정보가 없습니다. 다시 로그인해주세요.");
      return;
    }

    try {
      const response = await fetch(`${SERVER_URL}/api/v1/voucher/use`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serialNumber: serial, ownerId: ownerId }),
      });
      
      const result = await response.text();

      if (response.ok) {
        Alert.alert("✅ 성공", "결제가 완료되었습니다!", [{ 
          text: "확인", 
          onPress: () => router.back() 
        }]);
      } else {
        Alert.alert("❌ 실패", result, [{ 
          text: "다시 스캔", 
          onPress: () => {
            setScanned(false);
            // 1초 뒤에 브레이크 풀기 (바로 풀면 또 중복 스캔됨)
            setTimeout(() => { lockScan.current = false; }, 1000);
          } 
        }]);
      }
    } catch (error) {
      Alert.alert("에러", "서버 연결 실패");
      setScanned(false);
      lockScan.current = false;
    }
  };

  // 📸 카메라가 QR을 발견했을 때
  const handleBarCodeScanned = ({ type, data }: any) => {
    // 🛑 브레이크가 걸려있으면 무시해라!
    if (lockScan.current) return;
    
    // 즉시 브레이크 걸기!
    lockScan.current = true;
    setScanned(true);

    Alert.alert("스캔 완료", `번호: ${data}\n결제하시겠습니까?`, [
      { 
        text: "취소", 
        onPress: () => {
          setScanned(false);
          // 취소했을 때도 잠시 기다렸다가 풀기
          setTimeout(() => { lockScan.current = false; }, 1000);
        }, 
        style: "cancel" 
      },
      { 
        text: "승인", 
        onPress: () => processPayment(data) 
      }
    ]);
  };

  const handleManualSubmit = () => {
    if (!manualSerial) return Alert.alert("입력 오류", "번호를 입력해주세요.");
    processPayment(manualSerial);
  };

  if (hasPermission === null && Platform.OS !== 'web') return <Text>권한 요청 중...</Text>;
  if (hasPermission === false && Platform.OS !== 'web') return <Text>권한 없음</Text>;

  return (
    <View style={styles.container}>
      {Platform.OS !== 'web' && (
        <CameraView
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          style={StyleSheet.absoluteFillObject}
        />
      )}

      <View style={styles.manualContainer}>
        <Text style={styles.infoText}>상품권 QR코드를 비춰주세요</Text>
        <TextInput 
          style={styles.input}
          placeholder="또는 번호 직접 입력"
          value={manualSerial}
          onChangeText={setManualSerial}
        />
        <TouchableOpacity style={styles.manualButton} onPress={handleManualSubmit}>
          <Text style={styles.buttonText}>수동 결제</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <Text style={styles.closeText}>닫기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', backgroundColor: '#000' },
  manualContainer: { 
    position: 'absolute', bottom: 0, left: 0, right: 0, 
    backgroundColor: 'white', padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, alignItems: 'center' 
  },
  infoText: { color: '#333', marginBottom: 10, fontSize: 16, fontWeight: 'bold' },
  input: { width: '100%', borderWidth: 1, borderColor: '#ddd', padding: 15, borderRadius: 10, marginBottom: 10, fontSize: 16 },
  manualButton: { width: '100%', backgroundColor: '#2563EB', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 10 },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  closeButton: { padding: 10 },
  closeText: { color: '#666' },
});