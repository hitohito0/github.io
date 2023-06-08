import {loadGLTF, loadAudio} from "libs/loader.js";
const THREE = window.MINDAR.FACE.THREE;

document.addEventListener('DOMContentLoaded', () => {
  
  const start = async() => {

    const mindarThree = new window.MINDAR.FACE.MindARThree({
      container: document.body,
    });
    const {renderer, scene, camera} = mindarThree;

    const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
    scene.add(light);

    const glasses = await loadGLTF('asset/models/mudai/scene.gltf');
    glasses.scene.scale.set(7,5,5);
    glasses.scene.position.set(0, -7, 0);
    glasses.scene.userData.clickable = true

    const anchor = mindarThree.addAnchor(0);
    anchor.group.add(glasses.scene);

    //audio
    const audio = await loadAudio('asset/sounds/musicband-background.mp3');

    const listener = new THREE.AudioListener();
    camera.add(listener);
    
    const sound = new THREE.Audio(listener);;

    sound.setBuffer(audio);
   
    document.body.addEventListener('click', (e) => {
      // normalize to -1 to 1
      const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      const mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
      const mouse = new THREE.Vector2(mouseX, mouseY);
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
	let o = intersects[0].object; 
	while (o.parent && !o.userData.clickable) {
	  o = o.parent;
	}
	if (o.userData.clickable) {
	  if (o === glasses.scene) {
	    sound.play();
      action.play();
	  }
	}
      }
    });
    
    //animation
    const mixer = new THREE.AnimationMixer(glasses.scene);
    const action = mixer.clipAction(glasses.animations[1]);
    

    const clock = new THREE.Clock();

    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      const delta = clock.getDelta();
      mixer.update(delta);
      renderer.render(scene, camera);
    });
  }
  start();
});

