import Cookies from 'universal-cookie';
import CryptoJS from 'crypto-js';

const cookies = new Cookies();
const SECRET_KEY = import.meta.env.ENV_SECRET_KEY

export const localstore = (GSTIN) => {
    localStorage.setItem("GSTIN",GSTIN );
  
};
  
export const getLocalStorageValues = (key) => {
return localStorage.getItem(key);
};



export const storeCookieData = (key, value) => {
    // const encryptedKey = CryptoJS.AES.encrypt(JSON.stringify(key), SECRET_KEY).toString();
    const encryptedValue = CryptoJS.AES.encrypt(JSON.stringify(value), SECRET_KEY).toString();
    console.log('storing cookie data', key, encryptedValue)
    if (encryptedValue) cookies.set(key, encryptedValue, {path: '/'})
}




export function getCookieData(key) {
    const keys=cookies.get(key);
    console.log("key2",keys,key)
    if(keys){
    const decrypted = CryptoJS.AES.decrypt(keys, SECRET_KEY).toString(CryptoJS.enc.Utf8);
    console.log("key22",key,keys,decrypted)
    return JSON.parse(decrypted);
    }
    
    
    
  }


// Remove Single Cookie Data

export function removeCookieData(key) {
return cookies.remove(key, { path: "/" });
}
  
//  Removing all Cookie Data

export async function ClearCookie() {
const allCookie = cookies.getAll();
if (allCookie) {
    for (let key in allCookie) {
    await cookies.remove(key, { path: "/" });
    } 
}
}

  
export async function printDiv(id, style) {
var content = document.getElementById(id);
console.log(content,"content")
if (content) {
    var pri = document.getElementById("ifmcontentstoprint").contentWindow;
    // pri+=htmlToPrint;
    pri.document.open();
    pri.document.write(style);
    pri.document.write(content.innerHTML);
    pri.document.close();
    pri.focus();
    pri.print();
    return true
}
}


