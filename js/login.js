//Kiểm tra đã đăng nhập hay chưa
let current = sessionStorage.getItem("currentUser_LoggedIn")
if(current)
{
    alert("Hiện tại đã đăng nhập, vui lòng đăng xuất để đăng nhập tài khoản khác!!");
    window.location.href = "index.html";
}

////Kiểm tra trạng thái của nút mỗi lần có giá trị thay đổi trong từng input
document.getElementById("user").addEventListener("input", UnhideButton);
document.getElementById("pass").addEventListener("input", UnhideButton);

//Kiểm tra tài khoản có được nhớ mật khẩu không để autofill khi focus vào field nhập mật khẩu
document.getElementById("pass").addEventListener("focus", autofill);

var login = document.getElementById("log");
login.style.visibility = "hidden";
//Hàm autofill mật khẩu nếu tài khoản hiện tại được nhớ mật khẩu
function autofill() {
    let username = document.getElementById("user").value;
    let users = JSON.parse(localStorage.getItem("user"));
    for(let i = 0; i < users.length; i++)
    {
        if(users[i].username == username)
        {
            if(users[i].remember)
            {
                var password = document.getElementById("pass");
                password.value = users[i].password;
                //tạo 1 event mà sẽ coi như đã trigger event input 1 lần
                let autofill_password = new Event("input", {bubbles: true});
                //gán nó cho password ngay sau khi mật khẩu được tự động nhập
                password.dispatchEvent(autofill_password);
            }
        }
    }
}
//Hàm kiểm tra điều kiện để hiển thị nút
function isdisplayButton() {
    let username = document.getElementById("user").value;
    let password = document.getElementById("pass").value;
    let users = JSON.parse(localStorage.getItem("user"));
    if(users)
    {
        for(let i = 0; i < users.length; i++)
            {
                if(users[i].username == username && users[i].password == password)
                {
                    return true;
                }
            }   
    }
    return false;
}

//Hàm hiển thị nút
function UnhideButton() {
    if(isdisplayButton())
    {
        login.style.visibility = "visible";
    }
    else
    {
        login.style.visibility = "hidden";
    }
}



//Khi bấm được nút đăng nhập thì sẽ chuyển sang trang chủ
login.addEventListener("click", function() {
    let username = document.getElementById("user").value;
    let users = JSON.parse(localStorage.getItem("user"));
    let remember = document.getElementById("remember");
    if(remember.checked)
    {
        for(let i = 0; i < users.length; i++)
        {
            if(users[i].username == username)
            {
                users[i].remember = true;
                localStorage.setItem("user", JSON.stringify(users));
            }
        }
    }
    sessionStorage.setItem("currentUser_LoggedIn", username);

    window.location.href ="index.html";
})

