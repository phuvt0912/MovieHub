document.addEventListener("DOMContentLoaded", function() {
fetch("/js/movies.json")
.then(response => response.json())
.then(data => {
  var movies_array = data.movies;
  var session = sessionStorage.getItem("currentUser_LoggedIn");
  var url = new URLSearchParams(window.location.search);
  var id = url.get("id");
  document.getElementById("history").addEventListener("click", function() {
    if (!session)
    {
      alert("Vui lòng đăng nhập để sử dụng tính năng này");
      return false;
    }
    else if(session)
    {
      document.getElementById("history").href = "index.html?filter=history";
    }
  })
  for(let i = 0 ; i < movies_array.length; i++)
  { 
    if(movies_array[i].id == id)
    {
      document.getElementById("webtitle").innerHTML = "Xem " + movies_array[i].title;
      document.getElementById("title").innerHTML = movies_array[i].title;
      document.getElementById("img").src = movies_array[i].Image;
      document.getElementById("rate").getElementsByClassName("info_right")[0].innerHTML = movies_array[i].rating + " / 10";
      document.getElementById("release").getElementsByClassName("info_right")[0].innerHTML = movies_array[i].year;
      document.getElementById("total_ep").getElementsByClassName("info_right")[0].innerHTML = movies_array[i].ep_list.length;
      document.getElementById("description").innerHTML = movies_array[i].description;

      //genre
      for(let j = 0; j < movies_array[i].genre.length; j++)
      {
        let box = document.createElement("a");
        box.setAttribute("class", "genre");
        box.innerHTML = movies_array[i].genre[j];
        box.value = movies_array[i].genre[j];
        box.href = "index.html?genre=" + box.value;
        document.getElementById("genres").getElementsByClassName("info_right")[0].appendChild(box);
      }

      //episode_list
      for(let k = 1; k <= movies_array[i].ep_list.length; k++)
      {
        let ep_div = document.createElement("div"); // tạo 1 div 
        ep_div.setAttribute("class", "ep_div"); //đặt div đó class là ep_div
        let ep_box = document.createElement("a"); 
        ep_box.setAttribute("class", "ep");
        ep_box.innerHTML = k;
        ep_box.href = "watch.html?id=" +  movies_array[i].id + "&ep=" + k;
        ep_div.appendChild(ep_box);
        document.getElementById("episode_list").appendChild(ep_div);
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
  }
})
.catch(error => console.log(error));
})
