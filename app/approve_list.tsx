import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SERVER_URL } from './config';

export default function ApproveList() {
  const router = useRouter();
  const [list, setList] = useState([]);

  useEffect(() => {
    fetchPendingList();
  }, []);

  const fetchPendingList = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/api/v1/admin/vouchers/pending`);
      const data = await response.json();
      setList(data);
    } catch (error) {
      Alert.alert("에러", "목록을 불러올 수 없어요.");
    }
  };

  const handleApprove = async (applicationId: any) => {
    try {
      const response = await fetch(`${SERVER_URL}/api/v1/voucher/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId: applicationId }),
      });

      if (response.ok) {
        Alert.alert("성공", "승인 완료! 상품권이 발급되었습니다.");
        fetchPendingList(); 
      } else {
        Alert.alert("실패", "승인 처리에 실패했습니다.");
      }
    } catch (error) {
      Alert.alert("에러", "서버 연결 실패");
    }
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <View>
        <Text style={styles.name}>{item.applicantName}님의 신청</Text>
        <Text style={styles.status}>상태: {item.status}</Text>
      </View>
      <TouchableOpacity 
        style={styles.approveButton} 
        onPress={() => handleApprove(item.applicationId)}
      >
        <Text style={styles.buttonText}>승인</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>✅ 승인 대기 목록</Text>
      <FlatList
        data={list}
        renderItem={renderItem}
        keyExtractor={(item: any) => item.applicationId.toString()}
        ListEmptyComponent={<Text style={styles.emptyText}>대기 중인 신청이 없습니다 🎉</Text>}
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
  status: { fontSize: 14, color: '#888', marginTop: 5 },
  approveButton: { backgroundColor: '#10B981', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  closeButton: { marginTop: 10, padding: 15, alignItems: 'center' },
  closeText: { color: '#666', fontSize: 16 },
});