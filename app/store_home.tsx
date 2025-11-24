import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SERVER_URL } from './config'; // 👈 만능 주소

export default function StoreHome() {
  const router = useRouter();

  // 👇 정산 요청 함수
  const handleSettle = async () => {
    try {
      // (연습용이라 상점 번호는 1번으로 고정합니다!)
      const response = await fetch(`${SERVER_URL}/api/v1/voucher/settle?storeId=1`, {
        method: 'POST',
      });
      const result = await response.text();

      if (response.ok) {
        Alert.alert("요청 성공", result); // "N건의 정산 요청이 접수되었습니다."
      } else {
        Alert.alert("실패", "정산 요청에 실패했습니다.");
      }
    } catch (error) {
      Alert.alert("에러", "서버 연결 실패");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🏪</Text>
      <Text style={styles.title}>사장님 전용</Text>
      <Text style={styles.subtitle}>오늘도 대박 나세요!</Text>

      {/* 1. 결제 승인 버튼 */}
      <TouchableOpacity 
        style={[styles.button, styles.scanButton]} 
        onPress={() => router.push('/use')} 
      >
        <Text style={styles.buttonText}>📷 상품권 결제 (스캔)</Text>
      </TouchableOpacity>

      {/* 2. 정산 요청 버튼 (⭐️ 기능 연결됨!) */}
      <TouchableOpacity 
        style={[styles.button, styles.statsButton]} 
        onPress={handleSettle}
      >
        <Text style={styles.buttonText}>💰 오늘 매출 정산 요청</Text>
      </TouchableOpacity>

      {/* 3. 로그아웃 */}
      <TouchableOpacity 
        style={[styles.button, styles.logoutButton]} 
        onPress={() => router.replace('/')} 
      >
        <Text style={styles.logoutText}>로그아웃</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', alignItems: 'center', justifyContent: 'center', padding: 20 },
  emoji: { fontSize: 60, marginBottom: 10 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  subtitle: { fontSize: 18, color: '#666', marginBottom: 50 },
  button: { width: '100%', padding: 20, borderRadius: 15, alignItems: 'center', marginBottom: 15 },
  scanButton: { backgroundColor: '#2563EB' }, 
  statsButton: { backgroundColor: '#10B981' }, 
  logoutButton: { backgroundColor: '#eee', marginTop: 20 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  logoutText: { color: '#555', fontSize: 16 },
});