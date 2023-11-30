import { useState, useEffect, useRef } from "react";
import "./unsplash.css";
const api = "https://api.unsplash.com/search/photos/";
const accessKey = "Lc0adYv-qrIVVdScrD0bIE72CcKdI6jU4wUErrR2Vqo";

//search box component
const SearchBox = ({ onSearchHandler, filterString }) => {
  return (
    <>
      <div>
        <label htmlFor="filter">搜尋</label>
        <input
          type="text"
          id="filter"
          className="form-control"
          defaultValue={filterString}
          onKeyUp={onSearchHandler}
        />
      </div>
    </>
  );
};

//card conponent
const Card = ({ item }) => {
  return (
    <div className="card">
      <img
        src={item.urls.regular}
        className="card-img-top img-cover"
        height="300"
        width="100"
        alt="..."
      />
      <div className="card-body">
        <h5 className="card-title">Card title</h5>
        <p className="card-text">
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </p>
        <a href="#" className="btn btn-primary">
          Go somewhere
        </a>
      </div>
    </div>
  );
};

//unsplash display components
const Unsplash = () => {
  console.log("1.元件生成");
  //search
  const [filterString, setFilterString] = useState("animal");
  //get api data
  const [jsonData, setJsonData] = useState([]);
  //加入讀取事件 避免過度觸發
  const isLoading = useRef(false);
  //get current page
  const currentPage = useRef(1);
  //handle search,  after "Enter",then save the input of value
  const onSearchHandler = (e) => {
    if (e.key === "Enter") {
      setFilterString(e.target.value);
    }
  };

  //get photo function
  const getPhotos = async (page = 1) => {
    try {
      isLoading.current = true;
      //only download 1page everytime "&page=${page}""
      const result = await axios.get(
        `${api}?client_id=${accessKey}&query=${filterString}&page=${page}`
      );
      console.log(result);
      //這樣才不會覆蓋前一頁資料
      setJsonData((preData) => {
        console.log("更新資料觸發");
        return [...preData, ...result.data.results];
      });
      currentPage.current = page;
      setTimeout(() => {
        isLoading.current = false;
      }, 500);
    } catch (error) {
      console.log(error);
    }
  };

  //then use the input of value to get async api ; useEffect 來避免當用戶美輸入時重複刷新頁面
  const listRef = useRef(null);
  useEffect(() => {
    getPhotos(1, true);

    //滾動監聽 取得列表高度
    const scrollEvent = () => {
      console.log("scroll", window.scrollY); //垂直滾動的位置
      const height = listRef.current.offsetHeight + listRef.current.offsetTop;
      const totalheight = height - window.innerHeight;
      if (!isLoading.current && window.scrollY > totalheight) {
        //沒有在讀取狀態時並滾動到下方才能觸發得到新照片
        currentPage.current++;
        getPhotos(currentPage.current, false);
      }
    };

    window.addEventListener("scroll", scrollEvent);
    return () => window.removeEventListener("scroll", scrollEvent);
  }, [filterString]);

  return (
    <>
      {/*JSON.stringify(jsonData)TEST OFF SAVING DATA*/}
      {console.log("2.display")}
      <SearchBox
        onSearchHandler={onSearchHandler}
        filterString={filterString}
      />
      <div className="row row-cols-2 g-3" ref={listRef}>
        {jsonData.map((item) => {
          return (
            <div className="col-12 col-md-6 col-lg-4" key={item.id}>
              <Card item={item} />
            </div>
          );
        })}
      </div>
    </>
  );
};
export default Unsplash;
