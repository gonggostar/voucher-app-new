import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SERVER_URL } from '../config'; // 만능 주소
import { setUserId } from '../session'; // 내 번호 저장

export default function App() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const url = `${SERVER_URL}/api/v1/user/login`;

    try {
      console.log("로그인 시도...", url);
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username, password: password }),
      });

      const text = await response.text();
      console.log("서버 응답(원본):", text);

      if (text.length === 0) {
        Alert.alert("실패", "아이디가 없거나 비밀번호가 틀렸습니다.\n(혹은 서버가 꺼져있나요?)");
        return;
      }

      const data = JSON.parse(text);

      if (response.ok) {
        setUserId(data.userId);

        if (data.role === 'STORE') {
          Alert.alert("사장님 환영합니다!", "매장 관리 페이지로 이동합니다.", [
            { text: "이동", onPress: () => router.replace('/store_home' as any) }
          ]);
        } else if (data.role === 'ADMIN') {
          Alert.alert("관리자님 오셨습니까!", "관리 페이지로 이동합니다.", [
            { text: "업무 시작", onPress: () => router.replace('/admin_home' as any) }
          ]);
        } else {
          // 일반 고객
          Alert.alert("환영합니다!", `${data.name}님 로그인 성공!`, [
            { text: "홈으로", onPress: () => router.replace('/home' as any) }
          ]);
        }
      } else {
        Alert.alert("실패", "로그인에 실패했습니다.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("에러", "서버와 연결할 수 없어요.");
    }
  };

  return (
    <View style={styles.container}>
      
      {/* 👇 (수정됨) 로고 디자인 적용! */}
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>SKY COMO</Text>
        
        <Text style={styles.subLogoText}>
          WOOMI-NEW<Text style={{ color: '#FF8C00', fontWeight: '900' }}>V</Text>
        </Text>

        {/* 👇 추가된 한글 설명 */}
        <Text style={{ fontSize: 16, color: '#64748b', marginTop: 5, fontWeight: '600' }}>
          스마트 상품권
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>아이디</Text>
        <TextInput 
          style={styles.input} 
          placeholder="아이디를 입력하세요" 
          value={username} 
          onChangeText={setUsername} 
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>비밀번호</Text>
        <TextInput 
          style={styles.input} 
          placeholder="비밀번호를 입력하세요" 
          secureTextEntry={true} 
          value={password} 
          onChangeText={setPassword} 
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>로그인 하기</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={{ marginTop: 20, padding: 10 }} 
        onPress={() => router.push('/signup' as any)}
      >
        <Text style={{ color: '#666', textDecorationLine: 'underline' }}>
          계정이 없으신가요? 회원가입
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', padding: 30 },
  
  // 👇 로고 스타일 (home.tsx와 동일하게 맞춤)
  logoContainer: { alignItems: 'center', marginBottom: 40 },
  logoText: { 
    fontSize: 48, 
    fontWeight: '900', 
    color: '#1e293b', 
    letterSpacing: 2, 
    marginBottom: 5 
  },
  subLogoText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94a3b8',
    letterSpacing: 6, 
  },

  inputContainer: { width: '100%', marginBottom: 20 },
  label: { fontSize: 14, color: '#333', marginBottom: 5, fontWeight: 'bold' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', padding: 15, borderRadius: 10, fontSize: 16 },
  button: { width: '100%', backgroundColor: '#3B82F6', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});