import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
    stages: [
        // 0 a 200 usuários em 2 minutos
        { duration: '2m', target: 200 }, 
        // 200 a 500 usuários em 2 minutos
        { duration: '2m', target: 500 }, 
        // 500 a 1000 usuários em 2 minutos
        { duration: '2m', target: 1000 }, 
    ],
};

export default function () {
    const res = http.post('http://localhost:3000/checkout/crypto', JSON.stringify({
        userId: 'user-' + __VU, 
        amount: 100.00,
    }), {
        headers: { 'Content-Type': 'application/json' },
        timeout: '30s', 
    });


    sleep(1); 
}