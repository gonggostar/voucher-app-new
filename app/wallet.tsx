import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg'; // 👈 QR 생성기
import { SERVER_URL } from './config';
import { getUserId } from './session'; // 내 번호 가져오기

export default function Wallet() {
  const router = useRouter();
  const [vouchers, setVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null); // 선택된 상품권 (팝업용)

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    const myId = getUserId(); // 로그인한 내 번호
    if (!myId) {
      Alert.alert("오류", "로그인 정보가 없습니다.");
      return;
    }

    try {
      const response = await fetch(`${SERVER_URL}/api/v1/voucher/list/${myId}`);
      const result = await response.json();
      if (response.ok) setVouchers(result);
    } catch (error) {
      Alert.alert("에러", "목록을 불러올 수 없어요.");
    }
  };

  const renderVoucher = ({ item }: any) => (
    <TouchableOpacity 
      style={styles.ticket} 
      onPress={() => {
        if(item.status === 'UNUSED') setSelectedVoucher(item); // 누르면 QR 팝업 띄우기!
        else Alert.alert("알림", "이미 사용한 상품권입니다.");
      }}
    >
      <View style={styles.ticketLeft}>
        <Text style={styles.ticketTitle}>₩ 10,000</Text>
        <Text style={styles.ticketType}>{item.type === 'GENERAL' ? '통합 상품권' : '지정 상품권'}</Text>
      </View>
      <View style={styles.ticketRight}>
        <Text style={styles.serialNumber}>No. {item.serialNumber.substring(0, 8)}...</Text>
        <Text style={[styles.status, item.status === 'UNUSED' ? styles.unused : styles.used]}>
          {item.status === 'UNUSED' ? '터치해서 사용' : '사용 완료'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👛 내 지갑</Text>
      <FlatList data={vouchers} renderItem={renderVoucher} keyExtractor={(item: any) => item.id.toString()} style={{ width: '100%' }} />
      <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}><Text style={styles.closeText}>닫기</Text></TouchableOpacity>

      {/* 👇 QR코드 팝업창 (Modal) */}
      <Modal visible={selectedVoucher !== null} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>사장님께 보여주세요</Text>
            
            {selectedVoucher && (
              <View style={{ alignItems: 'center', marginVertical: 20 }}>
                {/* QR 코드 생성! (내용은 일련번호) */}
                <QRCode value={(selectedVoucher as any).serialNumber} size={200} />
                <Text style={styles.modalSerial}>{(selectedVoucher as any).serialNumber}</Text>
              </View>
            )}

            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setSelectedVoucher(null)}>
              <Text style={styles.buttonText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20, paddingTop: 60, alignItems: 'center' },
  title: { fontSize: 30, fontWeight: 'bold', color: '#333', marginBottom: 20 },
  ticket: { backgroundColor: '#fff', borderRadius: 15, padding: 20, marginBottom: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 3, width: '100%' },
  ticketLeft: { flexDirection: 'column' },
  ticketTitle: { fontSize: 24, fontWeight: 'bold', color: '#3B82F6' },
  ticketType: { fontSize: 14, color: '#888', marginTop: 5 },
  ticketRight: { alignItems: 'flex-end' },
  serialNumber: { fontSize: 12, color: '#ccc', marginBottom: 5 },
  status: { fontSize: 14, fontWeight: 'bold' },
  unused: { color: '#4ECDC4' }, used: { color: '#FF6B6B' },
  closeButton: { backgroundColor: '#333', padding: 15, borderRadius: 10, width: '100%', alignItems: 'center', marginTop: 10 },
  closeText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  
  // 모달 스타일
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { width: 300, backgroundColor: 'white', borderRadius: 20, padding: 20, alignItems: 'center', elevation: 5 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  modalSerial: { marginTop: 10, color: '#666', fontSize: 12 },
  modalCloseButton: { backgroundColor: '#3B82F6', padding: 10, borderRadius: 10, width: '100%', alignItems: 'center', marginTop: 10 },
  buttonText: { color: 'white', fontWeight: 'bold' }
});