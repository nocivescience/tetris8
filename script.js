const gameEl=document.getElementById('game');
const scoreEl=document.getElementById('score');
let score=0;
const ctx=gameEl.getContext('2d');
const side_length=32;
const cols=10;  
const rows=20;
const width=gameEl.width;
const height=gameEl.height;
ctx.scale(side_length,side_length);
const shapes=[
    [],
    [
        [0,0,0,0],
        [1,1,1,1],
        [0,0,0,0],
        [0,0,0,0]
    ],
    [
        [2,0,0],
        [2,2,2],
        [0,0,0]
    ],
    [
        [0,0,3],
        [3,3,3],
        [0,0,0]
    ],
    [
        [4,4],
        [4,4]
    ],
    [
        [0,5,5],
        [5,5,0],
        [0,0,0]
    ],
    [
        [0,6,0],
        [6,6,6],
        [0,0,0]
    ],
    [
        [7,7,0],
        [0,7,7],
        [0,0,0]
    ]
]
const colors=[
    'black',
    'rgb(255, 29, 29)',
    'rgb(92, 255, 84)',
    'rgb(84, 255, 246)',
    'rgb(84, 124, 255)',
    'rgb(152, 84, 255)',
    'rgb(255, 84, 201)',
    'rgb(255, 58, 248)',
];
class Piece{
    constructor(shape,ctx){
        this.shape=shape;
        this.ctx=ctx;
        this.x=Math.floor(cols/2);
        this.y=0;
    }
    renderPiece(){
        this.shape.map((row,i)=>{
            row.map((cell,j)=>{
                if(cell!==0){
                    this.ctx.fillStyle=colors[cell];
                    this.ctx.fillRect(j+this.x,i+this.y,1,1);
                    this.ctx.lineWidth=.05;
                    this.ctx.strokeStyle='white';
                    this.ctx.strokeRect(j+this.x,i+this.y,1,1);
                }
            })
        })
    };
}
class ModelGame{
    constructor(ctx){
        this.ctx=ctx;
        this.fallingPiece=null;
        this.grid=this.makingStartingGrid();
    };
    makingStartingGrid(){
        let grid=[];
        for(let row=0;row<rows;row++){
            grid.push([]);
            for(let col=0;col<cols;col++){
                grid[row].push(0);
            }
        }
        return grid;
    };
    collision(x,y,candidate=null){
        const shape=candidate||this.fallingPiece.shape;
        const n=shape.length;
        for(let i=0;i<n;i++){
            for(let j=0;j<n;j++){
                if(shape[i][j]!==0){
                    const p=j+x;
                    const q=i+y;
                    if(p>=0&&p<cols&&q<rows){
                        if(this.grid[q][p]!==0){
                            return true;
                        }
                    }else{
                        return true;
                    }
                }
            }
        }
        return false;
    }
    renderGameState(){
        for (let i=0;i<this.grid.length;i++){
            for(let j=0;j<this.grid[i].length;j++){
                let cell =this.grid[i][j];
                this.ctx.lineWidth=.05;
                this.ctx.strokeStyle='white';
                this.ctx.strokeRect(j,i,1,1);
                this.ctx.fillStyle=colors[cell];
                this.ctx.fillRect(j,i,1,1);
            }
        }
        if(this.fallingPiece!==null){
            this.fallingPiece.renderPiece();
        }
    }
    moveDown(){
        if(this.fallingPiece===null){
            this.renderGameState();
            return;
        }else if(this.collision(this.fallingPiece.x,this.fallingPiece.y+1)){
            const shape=this.fallingPiece.shape;
            const x=this.fallingPiece.x;
            const y=this.fallingPiece.y;
            shape.map((row,i)=>{
                row.map((cell,j)=>{
                    let p=j+x;
                    let q=i+y;
                    if(p>=0&&p<cols&&q<rows&&cell!==0){
                        this.grid[q][p]=shape[i][j];
                    }
                })
            });
            if(this.fallingPiece.y===0){
                alert('Game Over');
                this.grid=this.makingStartingGrid();
            }
            this.fallingPiece=null;
        }else{
            this.fallingPiece.y++;
        }
        this.renderGameState();
    }
    move(right){
        if(this.fallingPiece===null){
            return;
        }
        let x=this.fallingPiece.x;
        let y=this.fallingPiece.y;
        if(right){
            if(!this.collision(x+1,y)){
                this.fallingPiece.x++;
            }
        }else{
            if(!this.collision(x-1,y)){
                this.fallingPiece.x--;
            }
        }
        this.renderGameState();
    }
    rotate(){
        if(this.fallingPiece!==null){
            let shape=[...this.fallingPiece.shape.map((row)=>[...row])];
            for(let y=0;y<shape.length;++y){
                for(let x=0;x<y;++x){
                    [shape[x][y],shape[y][x]]=[shape[y][x],shape[x][y]];
                }
            }
            shape.forEach((row)=>row.reverse());
            if(!this.collision(this.fallingPiece.x,this.fallingPiece.y,shape)){
                this.fallingPiece.shape=shape;
            }
        }
    }
}
const model= new ModelGame(ctx);
let time=1000;
setInterval(()=>{
    newGameState();
    scoreTetris(score);
    updateTime()
    }, time
)
function updateTime(){
    if(score>50&&score<=100){
        return time=400;
    }else if(score>100&&score<=150){
        return time=300;
    }else if(score>150&&score<=200){
        return time=200;
    }else if(score>200){
        return time=100;
    }
}
function newGameState(){
    fullSend();
    if(model.fallingPiece===null){
        const rand=Math.round(Math.random()*6)+1;
        const newPiece=new Piece(shapes[rand],ctx);
        model.fallingPiece=newPiece;
        model.moveDown();
    }else{
        model.moveDown();
    }
}
function scoreTetris(score){
    scoreEl.innerHTML=`score: ${score}`;
}
function fullSend(){
    const allFilled=(row)=>{
        for( let x of row){
            if(x===0){
                return false;
            }
        }
        return true;
    }
    for (let i=0;i<model.grid.length;i++){
        if(allFilled(model.grid[i])){
            model.grid.splice(i,1);
            model.grid.unshift([0,0,0,0,0,0,0,0,0,0]);
            score+=10;
            scoreTetris(score);
        }
    }
}
document.addEventListener('keydown',(e)=>{
    e.preventDefault();
    switch(e.key){
        case 'a'||'ArrowLeft':
            model.move(false);
            break;
        case 'd'||'ArrowRight':
            model.move(true);
            break;
        case 's'||'ArrowDown':
            model.moveDown();
            break;
        case 'w'||'ArrowUp':
            model.rotate();
            break;
    }
});