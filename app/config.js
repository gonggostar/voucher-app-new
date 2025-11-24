import Constants from 'expo-constants';
import { Platform } from 'react-native';

// 👇 자동으로 서버 주소를 찾아주는 마법의 함수!
const getBackendUrl = () => {
  // 1. PC 웹브라우저인 경우
  if (Platform.OS === 'web') {
    return 'http://127.0.0.1:8080';
  }

  // 2. 핸드폰(Expo Go)인 경우 -> 자동으로 컴퓨터 IP를 찾아냅니다!
  const debuggerHost = Constants.expoConfig?.hostUri;
  const localhost = debuggerHost?.split(':')[0];

  if (localhost) {
    return `http://${localhost}:8080`;
  }

  // 3. 못 찾았을 경우 (비상용) - 보통 여기까지 안 옵니다.
  return 'http://127.0.0.1:8080';
};

// ⭐️ 다른 파일에서 갖다 쓸 수 있게 내보내기
export const SERVER_URL = getBackendUrl();