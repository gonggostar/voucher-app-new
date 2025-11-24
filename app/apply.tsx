import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Apply() {
  const router = useRouter();

  // 👇 신청 버튼 누르면 실행되는 함수
  const handleApply = async () => {
    // 1. 서버 주소 (IP 주소 꼭 바꾸기!)
    const SERVER_URL = "http://192.168.1.16:8080/api/v1/voucher/apply";

    try {
      // 2. 서버에 신청서 보내기
      // (지금은 연습이니까 '1번 회원'이 신청한다고 가정할게요!)
      const response = await fetch(SERVER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 1 }), 
      });

      const result = await response.text();
      console.log(result);

      if (response.ok) {
        // 3. 성공하면 알림 띄우고 홈으로 돌아가기
        Alert.alert("성공!", "관리자에게 상품권을 신청했어요!\n승인을 기다려주세요.", [
          { text: "확인", onPress: () => router.back() } // 뒤로 가기
        ]);
      } else {
        Alert.alert("실패", "신청에 실패했어요.");
      }
    } catch (error) {
      Alert.alert("에러", "서버와 연결할 수 없어요.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🎫</Text>
      <Text style={styles.title}>상품권 신청</Text>
      <Text style={styles.description}>
        이벤트에 당첨되셨나요?{"\n"}
        아래 버튼을 누르면 관리자에게{"\n"}
        상품권 발급을 요청합니다.
      </Text>

      {/* 신청 버튼 */}
      <TouchableOpacity style={styles.button} onPress={handleApply}>
        <Text style={styles.buttonText}>지금 신청하기</Text>
      </TouchableOpacity>

      {/* 취소 버튼 */}
      <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
        <Text style={styles.cancelText}>취소하고 돌아가기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', padding: 20 },
  emoji: { fontSize: 80, marginBottom: 20 },
  title: { fontSize: 30, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  description: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 40, lineHeight: 24 },
  button: { width: '100%', backgroundColor: '#FF6B6B', padding: 18, borderRadius: 15, alignItems: 'center', marginBottom: 15 },
  buttonText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  cancelButton: { padding: 15 },
  cancelText: { color: '#999', fontSize: 16 },
});