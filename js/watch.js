document.addEventListener("DOMContentLoaded", function() {
    fetch("/js/movies.json")
    .then(response => response.json())
    .then(data => {
        var movies_array = data.movies; 
        var session = sessionStorage.getItem("currentUser_LoggedIn");
        var url = new URLSearchParams(window.location.search);
        var id = parseInt(url.get("id"));
        var ep = url.get("ep");
        document.getElementById("history").addEventListener("click", function() {
          if (!session)
          {
            alert("Vui lòng đăng nhập để sử dụng tính năng này");
          }
          else if(session)
          {
            document.getElementById("history").href = "index.html?filter=history";
            return;
          }
        })
        SaveHistory(id);
        for(let i = 0; i < movies_array.length; i++) {
            if(movies_array[i].id == id)
            {
                for(let j = 0; j < movies_array[i].ep_list.length; j++)
                {
                    if(j + 1 == ep)
                    {
                        document.getElementById("webtitle").innerHTML = movies_array[i].title + " " + "tập " + ep;
                        document.getElementById("movie_title").innerHTML = movies_array[i].title;
                        document.getElementById("video").src = movies_array[i].ep_list[j];
                        document.getElementById("episode_info").innerHTML = "Tập " + (j + 1);
                    }
                    else
                    {
                        const ep = document.createElement("a");
                        ep.innerText = j + 1;
                        ep.href = "watch.html?id=" + id + "&ep=" + (j + 1);
                        document.getElementById("episode_list").appendChild(ep);
                    }
                }
            }
            let user_icon = document.getElementById("user_icon");
            let user_submenu = document.getElementById("user_submenu");
            let session = sessionStorage.getItem("currentUser_LoggedIn");
      
            // Khi bấm vào icon user sẽ hiển thị submenu bao gồm nút đăng xuất và username của tài khoản
            user_icon.addEventListener("click", function() {
              document.getElementById("currentUser").innerHTML = "Tài khoản: " + session;
              user_submenu.style.visibility = "visible";
            });
      
            //Khi bấm vào chỗ trống khác sẽ ẩn submenu đi
            user_icon.addEventListener("blur", function() {
              setTimeout(function() {
                user_submenu.style.visibility = "hidden";
              }, 100)
            });
            //Hiển thị nút đăng xuất nếu đã log in
      
            if(session)
            {
              document.getElementById("log_btn").style.display = "none";
            }
            else
            {
              document.getElementById("user_icon").style.display = "none";
            }
            // //Sự kiện đăng xuất, sẽ làm xuất hiện nút đăng nhập và clear SessionStorage
            document.getElementById("logout").addEventListener("click", function() {
              sessionStorage.clear();
              window.location.reload();
            })
        }
        
    })
    .catch(error => console.log(error));
});

// Lưu thông tin của bộ phim mà người dùng vừa coi 
function SaveHistory(id) {
  let session = sessionStorage.getItem("currentUser_LoggedIn"); // lấy thông tin của người dùng hiện tại đang đăng nhập
  if(!session) //nếu không có ai đang đăng nhập thì hàm này sẽ trả về (không chạy gì cả)
  {
    return
  }
  else // nếu có người đăng nhập
  {
    //Lấy về danh sách lịch sử coi phim của tất cả người đã từng đăng nhập || nếu không có ai thì mảng rỗng
    let history = JSON.parse(localStorage.getItem("history")) || [];
    //Nếu chưa từng có ai đăng nhập
    if(history.length == 0)
    {
      //Thì sẽ push người dùng hiện tại với bộ phim đang coi vào luôn (ez)
      let currentuser = new Object();
      currentuser.user = session;
      currentuser.watched_film = [id];
      history.push(currentuser);
      localStorage.setItem("history", JSON.stringify(history));
      return
    }
    //Nếu mảng khác rỗng
    else
    {
      //Lặp qua tất cả người dùng
      for(let i = 0; i < history.length; i++)
      {
        //Tìm người đến người dùng hiện tại đang đăng nhập (nếu đã từng coi ít nhất 1 tập phim)
        if(history[i].user == session)
        {
          //Nếu bộ phim này chưa từng coi
          if(!history[i].watched_film.includes(id))
          {
            //Thì sẽ thêm vào lịch sử coi phim
            let currentuser = new Object();
            currentuser = history[i];
            currentuser.watched_film.push(id);
            history[i] = currentuser;
            localStorage.setItem("history", JSON.stringify(history));
            return
          }
          else // Nếu phim này đã coi rồi thì thôi, trả về và không làm gì cả
          {
            return
          }
        }
      }
      // nếu không tìm thấy người dùng đang đăng nhập trong danh sách (nghĩa là họ chỉ đăng nhập nhưng chưa coi gì hết)
      // Thì sẽ push người dùng hiện tại với bộ phim đang coi vào luôn (ez)
      let currentuser = new Object();
      currentuser.user = session;
      currentuser.watched_film = [id];
      history.push(currentuser);
      localStorage.setItem("history", JSON.stringify(history));
      return
    }
  }
}