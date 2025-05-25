//Kiểm tra trạng thái của nút mỗi lần có giá trị thay đổi trong từng input và nút
document.getElementById("userreg").addEventListener("input", UnhideButton);
document.getElementById("password_reg").addEventListener("input", UnhideButton);
document.getElementById("repeat_password").addEventListener("input", UnhideButton);
document.getElementById("checkbox").addEventListener("click", UnhideButton);


var error = document.getElementById("error");
var register = document.getElementById("register");
register.style.visibility = "hidden";

//Hàm sẽ làm hiển thị nút hoặc ẩn nó đi
function UnhideButton() {
    if(isdisplayButton())
    {
        error.innerHTML = "";
        register.style.visibility = "visible";
    }
    else
    {
        register.style.visibility = "hidden";
    }
}

//Hàm đăng ký tài khoản khi nút đăng ký được bấm
register.addEventListener("click", function() {
    let user = document.getElementById("userreg").value;
    let password = document.getElementById("password_reg").value;
    let user_array = JSON.parse(localStorage.getItem("user")) || [];
    var newuser = new Object();
    newuser.username = user;
    newuser.password = password;
    newuser.remember = false;
    user_array.push(newuser);
    localStorage.setItem("user", JSON.stringify(user_array));
    alert("Đăng kí thành công");
    window.location.href = "login.html";  
})

//Hàm kiểm tra điều kiện để nút hiển thị
function isdisplayButton() {
    if (!isuserchecked() || !ispasswordchecked() || !ischeckbox_checked()) 
    {
        return false
    }
    let user = document.getElementById("userreg").value;
    let user_array = JSON.parse(localStorage.getItem("user")) || [];

    // Kiểm tra nếu username đã tồn tại
    for (let User of user_array) {
        if (User.username === user) {
            error.innerHTML = "Tài khoản đã tồn tại";
            return false
        }
    }
    return true
}
//Hàm kiểm tra checkbox được check chưa
function ischeckbox_checked() {
    let checkbox = document.getElementById("checkbox");
    if(checkbox.checked) return true
    else
    {
        error.innerHTML = "Hãy đồng ý với điều khoản";
        return false
    }
}
//Hàm kiểm tra user đúng cú pháp chưa
function isuserchecked() {
    let user = document.getElementById("userreg").value;
    let user_regex = /^[a-zA-Z][a-zA-Z0-9]{5,}$/;
    if (!user.match(user_regex) || !user)
    {
        error.innerHTML = "Tên đăng nhập phải có ít nhất 6 kí tự, không bắt đầu bằng số và không chứa kí tự đặc biệt";
        return false
    }
    else
    {
        return true
    }
}
//Hàm kiểm tra mật khẩu đúng cú pháp và đúng mật khẩu nhập lại chưa
function ispasswordchecked() {
    let password = document.getElementById("password_reg").value;
    let repeat = document.getElementById("repeat_password").value;
    let password_regex = /(?=.*[a-z])(?=.*\d)(?=.*[A-Z]).{8,}/;
    if(!password || !repeat)
    {
        error.innerHTML = "Mật khẩu không được để trống";
        return false

    }
    else if(!password.match(password_regex))
    {
        error.innerHTML = "Mật khẩu phải có ít nhất 8 kí tự, 1 chữ hoa, 1 chữ thường và 1 số";
        return false
    }
    else if(password != repeat)
    {
        error.innerHTML = "Mật khẩu không trùng nhau";
        return false
    }
    else
    {
        return true;
    }
}