const directs = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
]

/**
 * 移動
 * @param {String[]} maze 迷宮
 * @param {String} wall 牆壁的符號
 * @param {Point} curr 現在點，一個包含x, y內容的object
 * @param {Point} end 終點，一個包含x, y內容的object
 * @param {Boolean[][]} seen 像是maze的結構，只不過是boolean[][]版本
 * @param {Point[]} path 路徑
 * @returns {Boolean} isEnd 離開此層函式本身也等於不再走，所以我們並不會使用return 決定是否要走。
 */
function walk(maze, wall, curr, end, seen, path) {
  // base case: 順序不影響
  if (curr.x < 0 || curr.x >= maze[0].length || curr.y < 0 || curr.y >= maze.length) {
    return false;
  }

  if (maze[curr.y][curr.x] === wall) {
    return false;
  }

  if (curr.x === end.x && curr.y === end.y) {
    return true;
  }

  if (seen[curr.y][curr.x]) {
    return false;
  }

  // note: recursive case 通常可解構為三個部分
  // 1. 進入遞迴前(pre recurse)
  seen[curr.y][curr.x] = true;   // 將走過的路紀錄為已走過
  path.push(curr)                    // 等於紀錄這次的前進 

  // 2. 遞迴(recurse)
  for (const direct of directs) {
    const [x, y] = direct;
    const newCurr = { x: curr.x + x, y: curr.y + y };

    if (walk(maze, wall, newCurr, end, seen, path)) return true;
  }

  // 3. 結束遞迴後(post recurse)
  path.pop()                     // 退回一步; ex: [{3, 1}, {3, 2}] => [{3, 1}]

  return false;
}

// actual solver
const maze =
  [
    '######S#',
    '#      #',
    '#E######',
  ];

function getMazePath(maze, wall, start, end) {
  const path = [];
  const seen = Array.from({ length: maze.length }, () => Array.from({ length: maze[0].length }).fill(false));


  walk(maze, wall, start, end, seen, path);

  return path
}

const path = getMazePath(maze, '#', { x: 6, y: 0 }, { x: 1, y: 2 });

console.log('===path===', path)

