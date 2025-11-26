import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      
      {/* 1. 디자인된 로고 타이틀 */}
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>SKY COMO</Text>
        {/* 👇 'V'만 따로 떼어내서 스타일을 줍니다! */}
        <Text style={styles.subLogoText}>
          WOOMI-NEW<Text style={{ color: '#FF8C00', fontWeight: '900' }}>V</Text>
        </Text>
      </View>

      <Text style={styles.subtitle}>환영합니다! 오늘도 즐거운 하루 되세요.</Text>

      {/* 2. 상품권 신청 버튼 */}
      <TouchableOpacity 
        style={[styles.button, styles.applyButton]} 
        onPress={() => router.push('/apply')}
      >
        <Text style={styles.buttonIcon}>🎁</Text>
        <Text style={styles.buttonText}>상품권 신청하기</Text>
      </TouchableOpacity>

      {/* 3. 내 지갑 버튼 */}
      <TouchableOpacity 
        style={[styles.button, styles.walletButton]} 
        onPress={() => router.push('/wallet')}
      >
        <Text style={styles.buttonIcon}>👛</Text>
        <Text style={styles.buttonText}>내 지갑 열기 (QR)</Text>
      </TouchableOpacity>

      {/* (사장님 버튼은 삭제되었습니다!) */}

      {/* 4. 로그아웃 버튼 */}
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
  container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', padding: 30 },
  
  // 로고 디자인
  logoContainer: { alignItems: 'center', marginBottom: 10 },
  logoText: { 
    fontSize: 48, 
    fontWeight: '900', // 아주 굵게
    color: '#1e293b',  // 진한 남색 (고급스러움)
    letterSpacing: 2,  // 글자 간격 넓게
    marginBottom: 5 
  },
  subLogoText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94a3b8', // 은은한 회색
    letterSpacing: 6, // 자간을 아주 넓게 해서 세련된 느낌
    marginBottom: 20
  },

  subtitle: { fontSize: 16, color: '#64748b', marginBottom: 50 },
  
  // 버튼 디자인 (그림자 추가)
  button: { 
    width: '100%', 
    padding: 20, 
    borderRadius: 20, 
    alignItems: 'center', 
    marginBottom: 15,
    flexDirection: 'row', // 아이콘과 글자 가로 정렬
    justifyContent: 'center',
    
    // 그림자 효과 (iOS + Android)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5, 
  },
  
  applyButton: { backgroundColor: '#FF6B6B' }, // 따뜻한 분홍색
  walletButton: { backgroundColor: '#4ECDC4' }, // 산뜻한 민트색
  logoutButton: { backgroundColor: '#f1f5f9', marginTop: 20, elevation: 0 }, // 로그아웃은 평평하게
  
  buttonIcon: { fontSize: 24, marginRight: 10 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  logoutText: { color: '#64748b', fontSize: 16, fontWeight: '600' },
});