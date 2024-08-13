export interface IVelocity { x: number; y: number }

export interface IGameObject {
	x: number;
	y: number;
	radius: number;
	color: string;
	velocity: IVelocity | null;
	alpha: number;
}