import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '30s', target: 10 },  // 10 VUs por 30s
        { duration: '10s', target: 300 }, // Salto imediato para 300 VUs em 10s
        { duration: '1m', target: 300 },  // Manter por 1 minuto
        { duration: '10s', target: 10 },  // Queda imediata para 10 VUs
    ],
    thresholds: {
        http_req_failed: ['rate<0.05'], 
        http_req_duration: ['p(99)<2000'], 
    },
};

export default function () {
    const res = http.post('http://localhost:3000/checkout/simple', JSON.stringify({
        productId: 456,
        quantity: 1,
    }), {
        headers: { 'Content-Type': 'application/json' },
    });

    check(res, {
        'status is 201': (r) => r.status === 201,
    });

    sleep(1); 
}