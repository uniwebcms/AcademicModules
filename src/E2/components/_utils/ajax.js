import axios from 'axios';

export default axios.create({
    headers: {
        Accept: '*/*',
        'Content-Type': 'application/json',
    },
});
