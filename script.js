const gameEl=document.getElementById('game');
const ctx=gameEl.getContext('2d');
const side_length=20;
const cols=10;  
const rows=20;
const width=gameEl.width;
const height=gameEl.height;
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
class Piece{
    consructor(shape,ctx){
        this.shape=shape;
        this.ctx=ctx;
        this.x=Math.floor(cols/2);
        this.y=0;
    }
    colors=[
        'block',
        'rgb(255, 29, 29)',
        'rgb(92, 255, 84)',
        'rgb(84, 255, 246)',
        'rgb(84, 124, 255)',
        'rgb(152, 84, 255)',
        'rgb(255, 84, 201)',
    ]
    renderPiece(){
        this.shape((row,col)=>{
            if(this.shape[row][col]){
                this.ctx.fillRect(this.x+col,this.y+row,1,1);
            }
        });
    };
}