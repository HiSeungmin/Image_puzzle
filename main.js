const container = document.querySelector(".image-container")
const startButton = document.querySelector(".start-button")
const gameText = document.querySelector(".game-text")
const playTime = document.querySelector(".play-time")

const tileCount = 16;

let tiles = [];

const dragged = {
    el: null,
    class: null,
    index: null,
}

let isPlaying = false;
let timeInterval = null;
let time = 0;

// function
//setGame();

function checkStatus() {
    const currentList = [...container.children];
    const unMatchedList = currentList.filter((child, index) => Number(child.getAttribute("data-index")) !== index)
    if(unMatchedList.length === 0){
        gameText.style.display = "block";
        isPlaying = false;
        clearInterval(timeInterval)
    }    
}

function setGame(){
    isPlaying = true;
    time = 0;
    container.innerHTML = "";
    gameText.style.display = 'none'
    clearInterval(timeInterval)

    tiles = createImageTiles();
    //onsole.log(tiles)
    tiles.forEach(tile => container.appendChild(tile))   // 처음에는 정상적인 타일을 보여줘야함.

    setTimeout(()=>{
        container.innerHTML = ""; //타일이 겹칠 수 있으니까 한 번 초기화 해줌.
        shuffle(tiles).forEach(tile => container.appendChild(tile))
        timeInterval = setInterval(()=> {
            playTime.innerText = time;
            time++;
        }, 1000)
    }, 5000) // 2초 뒤 타일 섞음.
}

function createImageTiles(){
    const tempArray = [];
    Array(tileCount).fill().forEach((_, i)=> {
        const li = document.createElement("li");
        li.setAttribute('data-index', i)
        li.setAttribute('draggable', 'true'); //드래그 할 때마다 보임
        li.classList.add(`list${i}`);
        // console.log(li)
        tempArray.push(li)
    })
    return tempArray;
}

// 타일 섞는 함수
function shuffle(array){
    let index = array.length - 1; //마지막 인덱스
    while(index > 0){
        const randomIndex = Math.floor(Math.random()*(index+1)); // 소수점 자르기
        [array[index], array[randomIndex]] = [array[randomIndex], array[index]] // 두개 위치 바꾸기
        index--;
    }
    return array;
}

///////////////// events 리스너

container.addEventListener('dragstart', e => { //e : 드래그 클릭 했을 때
    if(!isPlaying) return;
    const obj = e.target
    // console.log(e)
    dragged.el = obj;
    dragged.class = obj.className;
    dragged.index = [...obj.parentNode.children].indexOf(obj);  // indexOf를 쓰려면 배열 형태여야함.
})

container.addEventListener('dragover', e => { //e :
    e.preventDefault()
})    

container.addEventListener('drop', e => { //e : 드래그 놓았을 때 놓은 element와 비교해서 바꾸기
    if(!isPlaying) return;
    const obj = e.target

    if(obj.className !== dragged.class) {
        let originPlace;
        let isLast = false;

        if(dragged.el.nextSibling){
            originPlace = dragged.el.nextSibling
        } else {
            originPlace = dragged.el.previousSibling
            isLast = true;
        }
        const droppedIndex = [...obj.parentNode.children].indexOf(obj);
        dragged.index > droppedIndex ? obj.before(dragged.el) : obj.after(dragged.el)
        isLast ? originPlace.after(obj) : originPlace.before(obj)
    }
    checkStatus();
})

startButton.addEventListener('click', ()=> {
    setGame()
})