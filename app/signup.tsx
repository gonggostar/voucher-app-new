import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SERVER_URL } from './config'; // 만능 주소

export default function Signup() {
  const router = useRouter();
  
  // 입력받을 정보들 (아이디, 비번, 전화번호, 이름)
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [realName, setRealName] = useState('');

  const handleSignup = async () => {
    // 1. 빈칸 검사
    if (!username || !password || !phoneNumber || !realName) {
      Alert.alert("알림", "모든 칸을 입력해주세요!");
      return;
    }

    const url = `${SERVER_URL}/api/v1/user/join`;

    try {
      // 2. 서버로 가입 요청 보내기
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username,
          password: password,
          phoneNumber: phoneNumber,
          realName: realName
        }),
      });

      const result = await response.text();

      if (response.ok) {
        Alert.alert("환영합니다!", "회원가입 성공! 로그인해주세요.", [
          { text: "로그인하러 가기", onPress: () => router.back() }
        ]);
      } else {
        Alert.alert("실패", result || "회원가입에 실패했습니다.");
      }
    } catch (error) {
      Alert.alert("에러", "서버와 연결할 수 없어요.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>회원가입</Text>
      <Text style={styles.subtitle}>우미뉴브 가족이 되어주세요!</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>아이디</Text>
        <TextInput style={styles.input} placeholder="아이디 입력" value={username} onChangeText={setUsername} />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>비밀번호</Text>
        <TextInput style={styles.input} placeholder="비밀번호 입력" secureTextEntry={true} value={password} onChangeText={setPassword} />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>이름</Text>
        <TextInput style={styles.input} placeholder="홍길동" value={realName} onChangeText={setRealName} />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>전화번호</Text>
        <TextInput style={styles.input} placeholder="010-0000-0000" keyboardType="phone-pad" value={phoneNumber} onChangeText={setPhoneNumber} />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>가입하기</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginLink} onPress={() => router.back()}>
        <Text style={styles.loginLinkText}>이미 계정이 있으신가요? 로그인</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#3B82F6', marginBottom: 5 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 30 },
  inputContainer: { width: '100%', marginBottom: 15 },
  label: { fontSize: 14, color: '#333', marginBottom: 5, fontWeight: 'bold' },
  input: { backgroundColor: '#f9f9f9', borderWidth: 1, borderColor: '#ddd', padding: 15, borderRadius: 10, fontSize: 16 },
  button: { width: '100%', backgroundColor: '#3B82F6', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  loginLink: { marginTop: 20 },
  loginLinkText: { color: '#666', fontSize: 14, textDecorationLine: 'underline' },
});