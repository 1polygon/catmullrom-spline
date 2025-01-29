import { SplineController } from './controller';
import { CatmullRomSpline } from './catmullrom';
import './style.css'

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

const spline = new CatmullRomSpline(canvas);
const controller = new SplineController(spline);
