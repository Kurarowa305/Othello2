import DomBoardView from './ui/DomBoardView';
import InfoPanel from './ui/InfoPanel';
import EndDialog from './ui/EndDialog';
import Board from './domain/Board';
import OthelloGame from './domain/OthelloGame';
import HumanPlayer from './domain/player/HumanPlayer';
import CpuPlayer from './domain/player/CpuPlayer';

const boardSize = 8;
const board = new Board(boardSize);
const domBoardView = new DomBoardView(board);
const infoPanel = new InfoPanel();
const endDialog = new EndDialog();

const player1 = new HumanPlayer();
const player2 = new CpuPlayer();
const game = new OthelloGame(player1, player2, boardSize);

game.registerObserver(domBoardView);

game.startGame();
