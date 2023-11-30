# React + Vite + unsplash API
## Description
This is a simple React app that allows users to search for photos using the Unsplash API and 
display them in a photo gallery. 
It includes features like infinite scrolling to load more photos as the user scrolls down.
practice useEffect, useStatus,useRef
- 防止過度觸發API
- 如沒有在讀取中並且視窗滾動到某個位置才觸發API
- 往下滾動後 會繼續觸發並傳回新資料 不會覆蓋之前資料
- 重新搜尋資料後 只顯示新資料
- 可以查看由unsplash api 傳來的剩餘次數
- 讀取圈圈效果
- 取得單張照片

## Features

- Search for photos based on a query.
- Infinite scrolling to load more photos.
- Responsive design for various screen sizes.
- 防止過度觸發API
- 如沒有在讀取中並且視窗滾動到某個位置才觸發API
- 不會覆蓋之前資料

## Technologies Used

- React vite
- Axios (for making API requests)
- Unsplash API



