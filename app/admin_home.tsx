import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SERVER_URL } from './config'; // 👈 만능 주소

export default function AdminHome() {
  const router = useRouter();

  // 👇 정산 완료 처리 함수
  const handleSettleComplete = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/api/v1/admin/settle`, {
        method: 'POST',
      });
      const result = await response.text();

      if (response.ok) {
        Alert.alert("처리 완료", result); // "총 N건의 정산 처리가 완료되었습니다."
      } else {
        Alert.alert("실패", "정산 처리에 실패했습니다.");
      }
    } catch (error) {
      Alert.alert("에러", "서버 연결 실패");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>👮‍♂️</Text>
      <Text style={styles.title}>관리실 (Admin)</Text>
      <Text style={styles.subtitle}>우미뉴브 통합 관리 시스템</Text>

      {/* 1. 회원 등급 관리 */}
      <TouchableOpacity 
        style={[styles.button, styles.roleButton]} 
        onPress={() => router.push('/user_list' as any)}
      >
        <Text style={styles.buttonText}>👥 회원 등급 관리 (사장님 승인)</Text>
      </TouchableOpacity>

      {/* 2. 상품권 승인 관리 */}
      <TouchableOpacity 
        style={[styles.button, styles.approveButton]} 
        onPress={() => router.push('/approve_list' as any)} 
      >
        <Text style={styles.buttonText}>✅ 상품권 발급 승인</Text>
      </TouchableOpacity>

      {/* 3. 정산 관리 (⭐️ 기능 연결됨!) */}
      <TouchableOpacity 
        style={[styles.button, styles.settleButton]} 
        onPress={handleSettleComplete}
      >
        <Text style={styles.buttonText}>💰 정산 처리 (입금 확인)</Text>
      </TouchableOpacity>

      {/* 로그아웃 */}
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
  container: { flex: 1, backgroundColor: '#f0f0f0', alignItems: 'center', justifyContent: 'center', padding: 20 },
  emoji: { fontSize: 60, marginBottom: 10 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  subtitle: { fontSize: 18, color: '#666', marginBottom: 50 },
  button: { width: '100%', padding: 20, borderRadius: 15, alignItems: 'center', marginBottom: 15 },
  roleButton: { backgroundColor: '#7C3AED' }, 
  approveButton: { backgroundColor: '#EA580C' }, 
  settleButton: { backgroundColor: '#059669' }, 
  logoutButton: { backgroundColor: '#ddd', marginTop: 20 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  logoutText: { color: '#555', fontSize: 16 },
});