import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { setUserId } from '../session'; // 👈 추가
// 👇 점 두 개(..)는 "상위 폴더(밖)로 나가라"는 뜻이에요!
import { SERVER_URL } from '../config';

export default function App() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    // 👇 주소 고민 끝! 알아서 찾아줍니다.
    const url = `${SERVER_URL}/api/v1/user/login`;

    try {
      console.log("로그인 시도...", url);
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username, password: password }),
      });

      const text = await response.text();
      if (text.length === 0) {
        Alert.alert("실패", "아이디나 비밀번호를 확인해주세요.");
        return;
      }
      const data = JSON.parse(text);

      if (response.ok) {
        setUserId(data.userId); // ⭐️ 로그인한 사람 번호 기억하기! (이 줄 추가)
        // 🚥 알림창(Alert) 없이 바로바로 이동시킵니다! (PC 호환성 해결)
        if (data.role === 'STORE') {
          console.log("사장님 모드로 이동");
          router.replace('/store_home' as any);
        } else if (data.role === 'ADMIN') {
          console.log("관리자 모드로 이동");
          router.replace('/admin_home' as any);
        } else {
          console.log("일반 고객 홈으로 이동");
          router.replace('/home' as any);
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
      <Text style={styles.title}>woomi-newv</Text>
      <Text style={styles.subtitle}>스마트 상품권 시스템</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>아이디</Text>
        <TextInput style={styles.input} placeholder="아이디" value={username} onChangeText={setUsername} />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>비밀번호</Text>
        <TextInput style={styles.input} placeholder="비밀번호" secureTextEntry={true} value={password} onChangeText={setPassword} />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>로그인 하기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { fontSize: 40, fontWeight: 'bold', color: '#3B82F6', marginBottom: 5 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 50 },
  inputContainer: { width: '100%', marginBottom: 20 },
  label: { fontSize: 14, color: '#333', marginBottom: 5, fontWeight: 'bold' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', padding: 15, borderRadius: 10, fontSize: 16 },
  button: { width: '100%', backgroundColor: '#3B82F6', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});