export const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const WALLS=[{x:190,y:330,w:100,h:60,label:'作業台'},{x:225,y:390,w:30,h:80,label:'棚'},{x:225,y:550,w:30,h:90,label:'棚'}];
export class Kitchen{
 constructor(seed=1701){this.seed=seed;this.time=0;this.score=0;this.served=0;this.snags=0;this.player={x:80,y:590};this.angle=-Math.PI/2;this.length=155;this.carrying=false;this.pickup={x:75,y:590};this.delivery={x:405,y:130};this.effects=[];this.message='料理を受け取って、右上の配膳口へ！';this.messageTime=3;this.acc=0;this.cooldown=0;this.pickupCooldown=0;this.updateHat();}
 updateHat(){this.hat=Array.from({length:6},(_,i)=>({x:this.player.x+Math.cos(this.angle)*this.length*i/5,y:this.player.y+Math.sin(this.angle)*this.length*i/5}));}
 say(s){this.message=s;this.messageTime=1.8;}
 burst(x,y,s,color='#ae4235'){this.effects.push({x,y,s,color,life:1.2});if(this.effects.length>12)this.effects.shift();}
 blocked(x,y,r){if(x-r<20||x+r>460||y-r<95||y+r>650)return true;return WALLS.some(w=>x>w.x-r&&x<w.x+w.w+r&&y>w.y-r&&y<w.y+w.h+r);}
 fits(x,y,angle=this.angle,hat=true){if(this.blocked(x,y,19))return false;if(!hat)return true;for(let d=0;d<=this.length;d+=5)if(this.blocked(x+Math.cos(angle)*d,y+Math.sin(angle)*d,17))return false;return !this.blocked(x+Math.cos(angle)*this.length,y+Math.sin(angle)*this.length,17);}
 advance(delta,dx=0,dy=0){this.acc+=clamp(delta,0,.1);while(this.acc+1e-10>=1/120&&this.time<60){this.step(1/120,dx,dy);this.acc-=1/120;}}
 step(dt,dx,dy){if(this.time>=60)return;this.time=Math.min(60,this.time+dt);if(60-this.time<1e-8)this.time=60;this.cooldown=Math.max(0,this.cooldown-dt);this.pickupCooldown=Math.max(0,this.pickupCooldown-dt);this.messageTime=Math.max(0,this.messageTime-dt);
 const speed=Math.min(1,Math.hypot(dx,dy));let caught=false;
 if(speed>.01){const target=Math.atan2(dy,dx)+Math.PI;const diff=Math.atan2(Math.sin(target-this.angle),Math.cos(target-this.angle));const next=this.angle+clamp(diff,-3.5*dt,3.5*dt);if(this.fits(this.player.x,this.player.y,next))this.angle=next;else caught=true;
 const norm=Math.max(1,Math.hypot(dx,dy)),mx=dx/norm*230*dt,my=dy/norm*230*dt;const oldX=this.player.x,oldY=this.player.y;
 if(this.fits(oldX+mx,oldY+my)){this.player.x+=mx;this.player.y+=my;}else{caught=true;if(this.fits(oldX+mx,oldY))this.player.x+=mx;if(this.fits(this.player.x,oldY+my))this.player.y+=my;}
 if(caught&&!this.cooldown){this.cooldown=1.5;this.snags++;this.say(this.fits(oldX+mx,oldY+my,this.angle,false)?'新人「体は通れるのに、帽子が！！」':'新人「回り道しましょう……！」');this.burst(this.player.x,this.player.y-35,'つっかえた！');}}
 this.updateHat();if(!this.carrying&&!this.pickupCooldown&&Math.hypot(this.player.x-this.pickup.x,this.player.y-this.pickup.y)<38){this.carrying=true;this.say('新人「料理より帽子が大荷物です！」');this.burst(this.player.x,this.player.y-45,'料理を受け取った','#35765e');}
 if(this.carrying&&Math.hypot(this.player.x-this.delivery.x,this.player.y-this.delivery.y)<38){this.carrying=false;this.served++;this.score+=500;this.pickupCooldown=1;this.say('客「運ぶだけで、そんなに大変！？」');this.burst(this.player.x,this.player.y-35,'提供！ +500円','#35765e');}
 for(const e of this.effects){e.life-=dt;e.y-=dt*18;}this.effects=this.effects.filter(e=>e.life>0);
 }
}
