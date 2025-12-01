import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  stages: [
    { duration: '20s', target: 10 },
    { duration: '20s', target: 20 },
    { duration: '20s', target: 5 },
    { duration: '20s', target: 15 },
    { duration: '20s', target: 0 },
  ],
};

export default function () {
  http.get('http://localhost:57050/api/orders');
  sleep(1);
}
