var currentPage;
const ItemPerPage = 20; // Số lượng item hiển thị trên mỗi trang
document.addEventListener("DOMContentLoaded", () =>  {

    fetch("/js/movies.json")
      .then((response) => response.json()) // chuyển đổi dữ liệu json sang javascript object
      .then((data) => {
        var session = sessionStorage.getItem("currentUser_LoggedIn");
        var movies_array = data.movies;
        //Đối tượng URLSearchParams là một interface cho phép bạn làm việc với các tham số truy vấn trong URL
        var params = new URLSearchParams(window.location.search);
        //lấy các tham số trên url 
        var keyword = params.get("keyword" );
        var genre_name = params.get("genre");
        var filter = params.get("filter");
        var page = params.get("page");
        //Đối tượng URL là một interface cho phép bạn làm việc với các URL
        var url = new URL(window.location.href);
  
        // Sắp xếp theo năm, nếu đang không hiển thị lịch sử phim đã xem
        if(!filter)
        {
          movies_array.sort((a, b) => b.year - a.year);
        }
        //filters
        movies_array = filterByGenre(genre_name, movies_array);
        movies_array = filterBykeyword(keyword, movies_array);
  
        //kiểm tra nếu chưa đăng nhập thì không xem được lịch sử phim
        document.getElementById("history_filter").style.visibility = "hidden";
        let history = document.getElementById("history");
        if(history)
        {
          history.addEventListener("click", function() {
            if (!session)
            {
              alert("Vui lòng đăng nhập để sử dụng tính năng này");
              return false;
            }
            else if(session)
            {
              document.getElementById("history").href = "index.html?filter=history";
              return;
            }
          })
        }
        
        //Nếu đã đăng nhập
        if(filter == "history" && session)
          {
  
            movies_array = filterByHistory(session, movies_array);
            document.getElementById("history_filter").style.visibility = "visible";
            document.getElementById("history_filter").innerHTML = "Lịch sử xem";
          }
          else if(filter && filter != "history")
          {
            window.location.href = "index.html";
          }
        var max_page = Math.ceil(movies_array.length / ItemPerPage);
        if(!page)
        {
          currentPage = 1;
        }
        else
        {
          currentPage = parseInt(page);
        }
  
        displayPage(currentPage, movies_array);
        // Nếu trang hiện tại không phải trang đầu cũng không phải trang cuối
        if(currentPage > 1 && currentPage < Math.ceil(max_page)) 
        {
          let prev_url = new URL(url.href);
          let next_url = new URL(url.href);
           //thay đổi giá trị (hoặc thêm mới) tham số "page" trong url
          prev_url.searchParams.set("page", currentPage - 1);
          next_url.searchParams.set("page", currentPage + 1);
          //Gán url mới cho các nút trước và sau
          document.getElementById("prev").href = prev_url.href;
          document.getElementById("next").href = next_url.href;
        }
        // Nếu trang hiện tại là trang đầu nhưng không phải trang cuối
        else if(currentPage == 1 && currentPage < Math.ceil(max_page))
        {
          let next_url = new URL(url.href);
          next_url.searchParams.set("page", currentPage + 1);
          document.getElementById("prev").href = url.href;
          document.getElementById("next").href = next_url.href;
        }
        //Nếu trang hiện tại là trang cuối nhưng không phải trang đầu
        else if(currentPage == Math.ceil(max_page) && currentPage > 1)
        {
          let prev_url = new URL(url.href);
          prev_url.searchParams.set("page", currentPage - 1);
          document.getElementById("next").href = url.href;
          document.getElementById("prev").href = prev_url.href;
        }
        //Nếu trang hiện tại là trang đầu và là trang cuối
        else if (Math.ceil(max_page) == 1)
        {
          document.getElementById("next").href = url.href;
          document.getElementById("prev").href = url.href;
        }
  
        // Set href cho nút đến trang cuối và trang đầu tiên
        let first_page = new URL(url.href); //lấy url hiện tại 
        let last_page = new URL(url.href); 
        first_page.searchParams.set("page", 1);
        last_page.searchParams.set("page", Math.ceil(max_page));
        document.getElementById("tofirst").href = first_page.href;
        document.getElementById("tolast").href = last_page.href;
  
  
        //GO button
        // thiết lập giá trị cho thuộc tính "max" cho input "goto_page"
        document.getElementById("goto_page").setAttribute("max", max_page);
        document.getElementById("goto_page").addEventListener("input", function() {
          let goto_page = document.getElementById("goto_page").value;
          if(goto_page > max_page)
          {
            goto_page = max_page;
          }
          else if(goto_page < 1)
          {
            goto_page = 1;
          }
          let go_url = new URL(window.location.href);
          go_url.searchParams.set("page", goto_page);
          document.getElementById("go_btn").href = go_url.href;
        })
  
        displayFilter(keyword, genre_name);
        if (!page)
        {
          document.getElementById("page_number").innerHTML = "Phim mới cập nhật";
        }
        else
        {
          document.getElementById("page_number").innerHTML = "Trang " + page;
        }
        // khai báo biến
        var user_icon = document.getElementById("user_icon");
        var user_submenu = document.getElementById("user_submenu");
  
        // Khi bấm vào icon user sẽ hiển thị submenu bao gồm nút đăng xuất và username của tài khoản
        user_icon.addEventListener("focus", () => {
          document.getElementById("currentUser").innerHTML = "Tài khoản: " + session;
          user_submenu.style.visibility = "visible";
        });
  
        //Khi bấm vào chỗ trống khác sẽ ẩn submenu đi
        user_icon.addEventListener("blur", function() {
          setTimeout(() => {
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
        //Sự kiện đăng xuất, sẽ làm xuất hiện nút đăng nhập và clear SessionStorage
        document.getElementById("logout").addEventListener("click", function() {
          sessionStorage.clear();
          window.location.reload();
        })
        // Hiện thị ra tất cả phim trong trong mảng

  
        
        //Nếu trang chủ không hiển thị phim nào thì sẽ hiển thị 1 dòng thông báo
        if(document.getElementById("movie_container").childElementCount == 0)
        {
          let notfound = document.createElement("h2");
          notfound.setAttribute("id", "noti");
          notfound.innerHTML = "Không tìm thấy phim với từ khóa: " + keyword;
          document.getElementById("movie_container").appendChild(notfound);
        }
      })
      .catch((error) => console.log(error));
  })

function create_item(item)
{
    const link = document.createElement("a");
    //Tao ra the div chua phim
    const movie_item = document.createElement("div");
    //set class cho div tren
    movie_item.setAttribute("class", "movie_item");
    //tao ra the div chua hinh anh
    const img_container = document.createElement("div");
    //set class cho div tren
    img_container.setAttribute("class", "img_container");
    //tao ra the img
    const img = document.createElement("img");
    //set class cho img
    img.setAttribute("class", "img");
    //tao the div cho tieu de
    const title_container = document.createElement("div");
    //set class cho div tren
    title_container.setAttribute("class", "title_container");
    //tao the span cho tieu de
    const title = document.createElement("span");
    //set class cho span
    title.setAttribute("class", "title");
    // Lông thêm hình ảnh và tiêu đề vào trong các thẻ div
    document.getElementById("movie_container").appendChild(movie_item);
    movie_item.appendChild(link);
    link.href = "detail.html?id=" + item.id;
    link.appendChild(img_container);
    link.appendChild(title_container);
    img_container.appendChild(img);
    title_container.appendChild(title);

    img.src = item.Image;
    title.innerHTML = item.title;
    return;
}

function displayPage(pageNumber, movies_array){
  for(let i = (pageNumber - 1) * ItemPerPage; i < pageNumber * ItemPerPage && i < movies_array.length; i++)
  {
    create_item(movies_array[i]);
  }
}

function filterByGenre(genre=genre, movies_array)
{
  if(genre == null)
  {
    return movies_array;
  }
  else
  {
    let filtered_movie = [];
    for(let i = 0; i < movies_array.length; i++)
    {
      if(movies_array[i].genre.includes(genre))
      {
        filtered_movie.push(movies_array[i]);
      }
    }
    return filtered_movie;
  }

}

function filterBykeyword(keyword=keyword, movies_array)
{
  if(keyword == null)
  {
    return movies_array;
  }
  else
  {
  let filtered_movie = [];
  for(let i = 0; i < movies_array.length; i++)
  {
    if(movies_array[i].title.toLowerCase().includes(keyword.toLowerCase()))
    {
      filtered_movie.push(movies_array[i]);
    }
  }
  return filtered_movie;
  }
}

function displayFilter(keyword, genre)
{
  if(keyword != null && genre != null)
  {
    document.getElementById("genre").innerHTML = "Thể loại: " + genre;
    document.getElementById("keyword").innerHTML = "Từ khóa: " + keyword;
  }
  else if(keyword == null || genre == null)
  {
    if(keyword == null && genre != null)
    {
      document.getElementById("keyword").style.display= "none";
      document.getElementById("genre").style.visibility = "visible";
      document.getElementById("genre").innerHTML = "Thể loại: " + genre;
    }
    else if(genre == null && keyword != null)
    {
      document.getElementById("genre").style.display = "none";
      document.getElementById("keyword").style.visibility = "visible";
      document.getElementById("keyword").innerHTML = "Từ khóa: " + keyword;
    }
    else if(genre == null & keyword == null)
    {
      document.getElementById("genre").style.display = "none";
      document.getElementById("keyword").style.display = "none";
    }
  }
}

function filterByHistory(session, movies_array) 
{
  let history = JSON.parse(localStorage.getItem("history")) || [];
  if (history.length === 0) 
  {
    alert("Anh bạn chưa coi gì cả, hay là mình làm tý MovieHub and chill nhỉ 🥤");
    return movies_array;
  }

  for (let i = 0; i < history.length; i++)
  {
    if (history[i].user === session) 
    {
      let tmp = [];
      for (let j = 0; j < movies_array.length; j++) 
      {
        for (let k = 0; k < history[i].watched_film.length; k++) 
        {
          if (movies_array[j].id === history[i].watched_film[k]) 
          {
            tmp.push(movies_array[j]);
            break; // Không cần kiểm tra tiếp nếu đã tìm thấy
          }
        }
      }
      return tmp;
    }
  }
  alert("Anh bạn chưa coi gì cả, hay là mình làm tý MovieHub and chill nhỉ 🥤");
  return movies_array;
}