import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SERVER_URL } from './config'; // 👈 만능 주소 가져오기!

export default function UserList() {
  const router = useRouter();
  const [users, setUsers] = useState([]); // 회원 명단을 담을 바구니

  // 화면이 켜지자마자 명단을 가져옵니다.
  useEffect(() => {
    fetchUserList();
  }, []);

  // 1. 서버에서 '모든 회원 목록' 가져오는 함수
  const fetchUserList = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/api/v1/admin/users`);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      Alert.alert("에러", "회원 목록을 불러올 수 없어요.");
    }
  };

  // 2. [사장님 승격] 버튼 눌렀을 때 실행되는 함수
  const handlePromote = async (userId: any) => {
    try {
      // PUT 방식으로 등급 변경 요청 (STORE로 변경)
      const response = await fetch(`${SERVER_URL}/api/v1/admin/user/${userId}/role?role=STORE`, {
        method: 'PUT', // 수정할 땐 PUT!
      });

      if (response.ok) {
        Alert.alert("성공", "회원 등급이 '사장님(STORE)'으로 변경되었습니다!");
        fetchUserList(); // ⭐️ 목록 새로고침 (변경된 등급을 바로 보여주기 위해!)
      } else {
        Alert.alert("실패", "등급 변경에 실패했습니다.");
      }
    } catch (error) {
      Alert.alert("에러", "서버 연결 실패");
    }
  };

  // 목록 한 줄 디자인 (카드 모양)
  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <View>
        <Text style={styles.name}>{item.realName} ({item.username})</Text>
        <Text style={[styles.role, item.role === 'STORE' ? styles.storeRole : styles.userRole]}>
          현재 등급: {item.role === 'STORE' ? '🏪 사장님' : (item.role === 'ADMIN' ? '👮‍♂️ 관리자' : '👤 일반 고객')}
        </Text>
      </View>
      
      {/* 일반 고객일 때만 [승격] 버튼 보여주기 */}
      {item.role === 'USER' && (
        <TouchableOpacity 
          style={styles.promoteButton} 
          onPress={() => handlePromote(item.userId)}
        >
          <Text style={styles.buttonText}>사장님 승격</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👥 회원 등급 관리</Text>
      
      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={(item: any) => item.userId.toString()}
        ListEmptyComponent={<Text style={styles.emptyText}>회원이 없습니다 😢</Text>}
      />

      <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
        <Text style={styles.closeText}>돌아가기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#999', fontSize: 18 },
  
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 15, marginBottom: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 2 },
  name: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  role: { fontSize: 14, marginTop: 5 },
  userRole: { color: '#888' },
  storeRole: { color: '#2563EB', fontWeight: 'bold' }, // 사장님은 파란색!
  
  promoteButton: { backgroundColor: '#7C3AED', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },

  closeButton: { marginTop: 10, padding: 15, alignItems: 'center' },
  closeText: { color: '#666', fontSize: 16 },
});