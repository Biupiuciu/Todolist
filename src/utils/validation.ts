export function isValidEmail(email:string,isForLogin:boolean) {
    if(isForLogin){
        if(email=='')return false;
        return true;
    }else{const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(email);}
    
}

export function isValidPassword(password:string,isForLogin:boolean) {
    if(isForLogin){
        if(password=='')return false;
        return true;
    }else{let count = 0;
        for (let char of password) {
          if (/\d/.test(char)) count++;
          if (count >= 8) return true;
        }
        return false;}
  
}


