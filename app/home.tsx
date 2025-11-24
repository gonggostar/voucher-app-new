import { useRouter } from 'expo-router'; // 👈 이동 마법 도구
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏠 메인 라운지</Text>
      <Text style={styles.subtitle}>우미왕님, 환영합니다!</Text>

      {/* 상품권 신청 버튼 */}
      <TouchableOpacity 
        style={[styles.button, styles.applyButton]} 
        onPress={() => router.push('/apply')}
      >
        <Text style={styles.buttonText}>🎁 상품권 신청하기</Text>
      </TouchableOpacity>

      {/* 내 지갑 보기 버튼 */}
      <TouchableOpacity 
        style={[styles.button, styles.walletButton]} 
        onPress={() => router.push('/wallet')}
      >
        <Text style={styles.buttonText}>👛 내 지갑 열기</Text>
      </TouchableOpacity>

      {/* 👇 추가된 사장님 모드 버튼 */}
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: '#333' }]} // 검은색 버튼
        onPress={() => router.push('/use')} // '/use' 방으로 이동!
      >
        <Text style={styles.buttonText}>🏪 사장님 모드 (결제)</Text>
      </TouchableOpacity>

      {/* 로그아웃 버튼 */}
      <TouchableOpacity 
        style={[styles.button, styles.logoutButton]} 
        onPress={() => router.replace('/')} // 다시 로그인 화면('/')으로 돌아가기
      >
        <Text style={styles.logoutText}>로그아웃</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 18, color: '#666', marginBottom: 50 },
  button: { width: '100%', padding: 20, borderRadius: 15, alignItems: 'center', marginBottom: 15 },
  applyButton: { backgroundColor: '#FF6B6B' }, // 분홍색
  walletButton: { backgroundColor: '#4ECDC4' }, // 민트색
  logoutButton: { backgroundColor: '#eee', marginTop: 20 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  logoutText: { color: '#555', fontSize: 16 },
});