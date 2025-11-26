import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, Modal, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native'; // 👈 RefreshControl 추가!
import QRCode from 'react-native-qrcode-svg';
import { SERVER_URL } from './config';
import { getUserId } from './session';

export default function Wallet() {
  const router = useRouter();
  const [vouchers, setVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [refreshing, setRefreshing] = useState(false); // 👈 새로고침 중인지 확인하는 상태

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    const myId = getUserId();
    if (!myId) return;

    try {
      const response = await fetch(`${SERVER_URL}/api/v1/voucher/list/${myId}`);
      const result = await response.json();
      if (response.ok) setVouchers(result);
    } catch (error) {
      // 조용히 실패 (새로고침 때는 에러창 안 띄우는 게 좋음)
      console.log(error);
    }
  };

  // 👇 당겨서 새로고침 할 때 실행되는 함수
  const onRefresh = useCallback(async () => {
    setRefreshing(true); // 빙글빙글 시작
    await fetchVouchers(); // 데이터 다시 가져오기
    setRefreshing(false); // 빙글빙글 멈춤
  }, []);

  const renderVoucher = ({ item }: any) => (
    <TouchableOpacity 
      style={styles.ticket} 
      activeOpacity={0.8} // 누를 때 살짝 투명해지는 효과
      onPress={() => {
        if(item.status === 'UNUSED') setSelectedVoucher(item);
        else Alert.alert("알림", "이미 사용한 상품권입니다.");
      }}
    >
      {/* 왼쪽: 금액과 종류 */}
      <View style={styles.ticketLeft}>
        <Text style={styles.ticketTitle}>₩ 10,000</Text>
        <Text style={styles.ticketType}>{item.type === 'GENERAL' ? '통합 상품권' : '지정 상품권'}</Text>
      </View>
      
      {/* 점선 효과 (가짜) */}
      <View style={styles.dashedLine} />

      {/* 오른쪽: 상태와 번호 */}
      <View style={styles.ticketRight}>
        <Text style={[styles.statusBadge, item.status === 'UNUSED' ? styles.bgMint : styles.bgRed]}>
          {item.status === 'UNUSED' ? '사용 가능' : '사용 완료'}
        </Text>
        <Text style={styles.serialNumber}>{item.serialNumber.substring(0, 8)}...</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👛 내 지갑</Text>
      <Text style={styles.guideText}>아래로 당겨서 새로고침 ⬇️</Text>

      <FlatList
        data={vouchers}
        renderItem={renderVoucher}
        keyExtractor={(item: any) => item.id.toString()}
        style={{ width: '100%' }}
        contentContainerStyle={{ paddingBottom: 100 }}
        // 👇 이게 핵심! 새로고침 기능 연결
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3B82F6" />
        }
        ListEmptyComponent={<Text style={styles.emptyText}>보유한 상품권이 없습니다 😢</Text>}
      />

      <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
        <Text style={styles.closeText}>닫기</Text>
      </TouchableOpacity>

      {/* QR코드 팝업 */}
      <Modal visible={selectedVoucher !== null} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>사장님께 보여주세요</Text>
            {selectedVoucher && (
              <View style={{ alignItems: 'center', marginVertical: 20 }}>
                <QRCode value={(selectedVoucher as any).serialNumber} size={200} />
                <Text style={styles.modalSerial}>{(selectedVoucher as any).serialNumber}</Text>
              </View>
            )}
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setSelectedVoucher(null)}>
              <Text style={styles.buttonText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6', padding: 20, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1F2937', marginBottom: 5 },
  guideText: { fontSize: 14, color: '#9CA3AF', marginBottom: 20 },
  
  // 티켓 디자인 업그레이드
  ticket: { 
    backgroundColor: '#fff', borderRadius: 12, marginBottom: 16, flexDirection: 'row', alignItems: 'center', 
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 5, // 그림자 효과
    height: 100
  },
  ticketLeft: { flex: 1, padding: 20, justifyContent: 'center' },
  ticketRight: { width: 100, padding: 10, justifyContent: 'center', alignItems: 'center', borderLeftWidth: 1, borderLeftColor: '#eee', borderStyle: 'dashed' }, // 점선 효과는 borderStyle로!
  
  ticketTitle: { fontSize: 22, fontWeight: 'bold', color: '#111' },
  ticketType: { fontSize: 13, color: '#6B7280', marginTop: 4 },
  
  statusBadge: { paddingVertical: 4, paddingHorizontal: 8, borderRadius: 20, overflow: 'hidden', color: 'white', fontSize: 12, fontWeight: 'bold', marginBottom: 8 },
  bgMint: { backgroundColor: '#10B981' },
  bgRed: { backgroundColor: '#EF4444' },
  
  serialNumber: { fontSize: 10, color: '#9CA3AF' },
  
  // 점선 꾸미기 (가운데 뚫린 느낌) - 일단은 심플하게 구현
  dashedLine: { width: 1, height: '80%', borderLeftWidth: 1, borderLeftColor: '#E5E7EB', borderStyle: 'dashed' },

  emptyText: { textAlign: 'center', marginTop: 50, color: '#9CA3AF', fontSize: 16 },
  closeButton: { position: 'absolute', bottom: 30, left: 20, right: 20, backgroundColor: '#1F2937', padding: 16, borderRadius: 15, alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 5 },
  closeText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)' },
  modalContent: { width: 300, backgroundColor: 'white', borderRadius: 20, padding: 24, alignItems: 'center', elevation: 10 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  modalSerial: { marginTop: 15, color: '#6B7280', fontSize: 14, fontFamily: 'monospace' },
  modalCloseButton: { backgroundColor: '#3B82F6', padding: 14, borderRadius: 12, width: '100%', alignItems: 'center', marginTop: 20 },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});