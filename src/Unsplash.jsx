import { useState, useEffect, useRef } from 'react';
import './unsplash.css';
const api = 'https://api.unsplash.com/search/photos/';
const accessKey = 'Lc0adYv-qrIVVdScrD0bIE72CcKdI6jU4wUErrR2Vqo';
//loading component
const Loading = ({ isLoading }) => {
  return (
    <div className='loading' style={{ display: isLoading ? 'flex' : 'none' }}>
      <div className='spinner-border' role='status'>
        <span className='visually-hidden'>Loading...</span>
      </div>
    </div>
  );
};
//search box component
const SearchBox = ({ onSearchHandler, filterString }) => {
  return (
    <>
      <div>
        <label htmlFor='filter'>搜尋</label>
        <input
          type='text'
          id='filter'
          className='form-control'
          defaultValue={filterString}
          onKeyUp={onSearchHandler}
        />
      </div>
    </>
  );
};
//card component
const Card = ({ item, getSinglePhoto }) => {
  return (
    <a
      href='#'
      className='card'
      onClick={(e) => {
        e.preventDefault();
        getSinglePhoto(item.id);
      }}
    >
      <img
        src={item.urls.regular}
        className='card-img-top img-cover'
        height='300'
        width='100'
        alt='...'
      />
      <div className='card-body'>
        <h5 className='card-title'>title</h5>
      </div>
    </a>
  );
};

//unsplash display components
const Unsplash = () => {
  //search
  const [filterString, setFilterString] = useState('cat');
  //get api data
  const [jsonData, setJsonData] = useState([]);
  //loading
  const [isLoading, setIsLoading] = useState(false);
  //加入讀取事件 避免過度觸發
  const isLoadingRef = useRef(false);
  //get current page
  const currentPage = useRef(1);
  //remain
  const [remaining, setRemaining] = useState(50);
  //點擊image後重新觸發傳回照片
  const modalRef = useRef(null);
  const myModal = useRef(null);
  const [photoUrl, setPhotoUrl] = useState('');
  //handle search,  after "Enter",then save the input of value
  const onSearchHandler = (e) => {
    if (e.key === 'Enter') {
      setFilterString(e.target.value);
    }
  };
  //get single photo function
  const getSinglePhoto = (id) => {
    (async () => {
      const api = 'https://api.unsplash.com/photos/';
      const result = await axios(`${api}${id}?client_id=${accessKey}`);
      setPhotoUrl(result.data.urls.regular);
      console.log(result, photoUrl);
      myModal.current.show();
    })();
  };

  //get photos function
  const getPhotos = async (page = 1, isNew = true) => {
    try {
      isLoadingRef.current = true;
      setIsLoading(true);
      //only download 1page every time "&page=${page}""
      const result = await axios.get(
        `${api}?client_id=${accessKey}&query=${filterString}&page=${page}`
      );
      console.log(result);
      //這樣才不會覆蓋前一頁資料
      setJsonData((preData) => {
        console.log('更新資料觸發');
        //如果是新輸入的搜尋資料
        if (isNew) {
          return [...result.data.results];
        }
        return [...preData, ...result.data.results];
      });
      setRemaining(result.headers['x-ratelimit-remaining']);
      currentPage.current = page; //確認每次回到的都是第一頁
      setTimeout(() => {
        isLoadingRef.current = false;
        setIsLoading(false);
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
      // console.log("scroll", window.scrollY); //垂直滾動的位置
      const height = listRef.current.offsetHeight + listRef.current.offsetTop;
      const totalheight = height - window.innerHeight;
      if (!isLoadingRef.current && window.scrollY > totalheight) {
        //沒有在讀取狀態時並滾動到下方才能觸發得到新照片
        currentPage.current++;
        getPhotos(currentPage.current, false);
      }
    };

    // This code adds an event listener to the window object to track scroll events.
    // When the scroll event occurs, it triggers the scrollEvent function.
    // The event listener is removed when the component unmounts or when the filterString value changes.
    window.addEventListener('scroll', scrollEvent);
    return () => window.removeEventListener('scroll', scrollEvent);
  }, [filterString]);

  //loading useEffect
  useEffect(() => {
    const body = document.querySelector('body');
    if (isLoading) {
      body.style.overflow = 'hidden';
    } else {
      body.style.overflow = 'auto';
    }
  }, [isLoading]);

  //for trigger to reloading image
  useEffect(() => {
    myModal.current = new bootstrap.Modal(modalRef.current);
    // myModal.current.show();
  }, []);

  return (
    <>
      {/*JSON.stringify(jsonData)TEST OFF SAVING DATA*/}
      <Loading isLoading={isLoading} />
      <SearchBox
        onSearchHandler={onSearchHandler}
        filterString={filterString}
      />
      <p>剩餘請求次數：{remaining}</p>

      <div className='row row-cols-2 g-3' ref={listRef}>
        {jsonData.map((item) => {
          if (!item.id) {
            console.warn('Item missing id:', item);
            return null; // 或者使用默認值
          }
          return (
            <div className='col-12 col-md-6 col-lg-4' key={item.id}>
              <Card item={item} getSinglePhoto={getSinglePhoto} />
            </div>
          );
        })}
      </div>
      {/* <!-- Button trigger modal --> */}
      <button
        type='button'
        className='btn btn-primary'
        data-bs-toggle='modal'
        data-bs-target='#exampleModal'
      >
        Launch demo modal
      </button>

      {/* Modal */}
      <div className='modal fade' tabIndex='-1' ref={modalRef}>
        <div className='modal-dialog'>
          <img src={photoUrl} alt='' width='100%' />
        </div>
      </div>
    </>
  );
};

export default Unsplash;
