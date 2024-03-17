import { Platform } from 'react-native'
let baseURL = '';

{
    Platform.OS == 'android'
        ? baseURL = 'https://backend-scheduler.onrender.com/api/v1/'
        : baseURL = 'http://localhost:4000/api/v1/'
}
// {
//     Platform.OS == 'android'
//         ? baseURL = 'https://backend-scheduler.onrender.com/api/v1/'
//         : baseURL = 'http://192.168.1.58:4000/api/v1/'
// }
//wifie sa bahay 192.168.1.58
//data ko 192.168.127.58
export default baseURL;