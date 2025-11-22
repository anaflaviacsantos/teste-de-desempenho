import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '1m', target: 50 }, // Ramp-up: 0 a 50 usuários em 1 minuto
        { duration: '2m', target: 50 }, // Platô: Manter 50 usuários por 2 minutos
        { duration: '30s', target: 0 },  // Ramp-down: 50 a 0 usuários em 30 segundos
    ],
    
    thresholds: {
        http_req_duration: ['p(95)<500'], 
        http_req_failed: ['rate<0.01'], 
    },
};

export default function () {
    const res = http.post('http://localhost:3000/checkout/simple', JSON.stringify({
        productId: 123,
        quantity: 1,
    }), {
        headers: { 'Content-Type': 'application/json' },
    });

    check(res, {
        'status is 201': (r) => r.status === 201,
        'response time < 500ms': (r) => r.timings.duration < 500,
    });

    sleep(1); 
}