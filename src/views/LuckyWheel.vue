<template>
  <div class="lucky-wheel-container">
    <div class="wheel-wrapper">
      <div class="wheel-pointer"></div>

      <div class="wheel-canvas" :style="wheelStyle">
        
        <div 
          v-for="(gift, index) in gifts" 
          :key="index" 
          class="gift-wrapper"
          :style="getGiftWrapperStyle(index)"
        >
          <div class="gift-content" :class="{'text-white': index % 2 === 0, 'text-blue': index % 2 !== 0}">
            <span class="gift-name">{{ gift.name }}</span>
            <img :src="gift.image" :alt="gift.name" class="gift-icon" />
          </div>
        </div>

      </div>

      <button 
        class="spin-button" 
        @click="spinWheel" 
        :disabled="isSpinning"
      >
        XOAY
      </button>
    </div>

    <div v-if="showPopup" class="prize-popup-overlay">
      <div class="prize-popup">
        <h3>🎉 Chúc mừng bạn!</h3>
        <p class="popup-text">Bạn đã trúng: <strong class="prize-highlight">{{ winningGift?.name }}</strong></p>        
        <button class="popup-btn" @click="handleConfirmPrize">Nhận quà ngay</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const getImageUrl = (name) => {
  return new URL(`../assets/images/${name}`, import.meta.url).href;
};

const gifts = ref([
  { name: 'Gel tẩy tế bào chết', image: getImageUrl('tay_te_bao_chet_1.png'), weight: 35 }, 
  { name: 'Gấu bông', image: getImageUrl('gaubong.png'), weight: 0 },          
  { name: 'Nón bảo hiểm', image: getImageUrl('nonbaohiem.png'), weight: 0 },
  { name: 'Gel tẩy tế bào chết', image: getImageUrl('tay_te_bao_chet_2.png'), weight: 30 },
  { name: 'Bút bi SGT', image: getImageUrl('butbi.png'), weight: 0 },
  { name: 'Gel tẩy tế bào chết', image: getImageUrl('tay_te_bao_chet_3.png'), weight: 35 },
  { name: 'Balo SGT', image: getImageUrl('balo.png'), weight: 0 },
  { name: 'Chúc bạn may mắn lần sau', image: getImageUrl('goodluck.png'), weight: 0 }
]);

const isSpinning = ref(false);
const rotation = ref(0); 
const winningIndex = ref(0);
const showPopup = ref(false);

const winningGift = computed(() => gifts.value[winningIndex.value]);

const totalSegments = gifts.value.length;
const degreesPerSegment = 360 / totalSegments;

const wheelStyle = computed(() => {
  return {
    transform: `rotate(${rotation.value}deg)`,
    transition: 'transform 4.5s cubic-bezier(0.15, 0.85, 0.35, 1)' 
  };
});

const getGiftWrapperStyle = (index) => {
  return {
    transform: `rotate(${index * degreesPerSegment}deg)`
  };
};

const spinWheel = () => {
  if (isSpinning.value) return;

  isSpinning.value = true;
  showPopup.value = false;

  const totalWeight = gifts.value.reduce((sum, gift) => sum + gift.weight, 0);
  

  let randomValue = Math.random() * totalWeight;
  let selectedIndex = 0;


  for (let i = 0; i < gifts.value.length; i++) {
    randomValue -= gifts.value[i].weight;
    if (randomValue <= 0) {
      selectedIndex = i;
      break;
    }
  }

  winningIndex.value = selectedIndex;

  const targetRotation = 360 - (selectedIndex * degreesPerSegment);
  const currentMod = rotation.value % 360;
  const spins = 1800;
  
  rotation.value += spins + (targetRotation - currentMod);

  setTimeout(() => {
    isSpinning.value = false;
    showPopup.value = true;
  }, 4500); 
};

const handleConfirmPrize = () => {
  showPopup.value = false;
};
</script>

<style scoped>
.lucky-wheel-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  background: linear-gradient(135deg, #f0f6fc 0%, #d9e8fa 50%, #f0f6fc 100%); 
  padding: 20px;
  overflow: hidden;
  z-index: 9999;
}

.wheel-wrapper {
  position: relative;
  width: 550px;
  height: 550px;
  max-width: 90vw;
  max-height: 90vw;
  border: 12px solid #002266; 
  border-radius: 50%;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
}

.wheel-pointer {
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;
  border-top: 35px solid #dd2c00;
  z-index: 10;
  filter: drop-shadow(0 4px 4px rgba(0,0,0,0.3));
}

.wheel-canvas {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  position: relative;
  overflow: hidden;
  background: conic-gradient(
    from -22.5deg,
    #003399 0deg 45deg,
    #ffffff 45deg 90deg,
    #003399 90deg 135deg,
    #ffffff 135deg 180deg,
    #003399 180deg 225deg,
    #ffffff 225deg 270deg,
    #003399 270deg 315deg,
    #ffffff 315deg 360deg
  );
}

.gift-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.gift-content {
  position: absolute;
  top: 25px; 
  left: 50%;
  transform: translateX(-50%); 
  width: 140px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.text-white { color: #ffffff; }
.text-blue { color: #003399; }

.gift-name {
  font-size: 15px;
  font-weight: bold;
  line-height: 1.3;
  margin-bottom: 5px;
  text-transform: uppercase;
  word-wrap: break-word; 
  max-width: 120px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gift-icon {
  width: 95px;
  height: 95px;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15));
}

.spin-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 85px;
  height: 85px;
  background: linear-gradient(145deg, #ff4110, #cc2800);
  color: #ffffff;
  border: 4px solid #ffffff;
  border-radius: 50%;
  font-size: 18px;
  font-weight: 900;
  cursor: pointer;
  box-shadow: 0 5px 15px rgba(0,0,0,0.5);
  z-index: 12;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
}

.spin-button:active {
  transform: translate(-50%, -50%) scale(0.92);
  box-shadow: 0 2px 8px rgba(0,0,0,0.6);
}

.spin-button:disabled {
  background: #7f8c8d;
  cursor: not-allowed;
  box-shadow: none;
}

/* --- POPUP CSS FIXES --- */
.prize-popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
}

.prize-popup {
  background: #ffffff !important;
  padding: 35px 45px;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0,0,0,0.3);
  width: 90%;
  max-width: 400px;
}

.prize-popup h3 {
  color: #003399 !important;
  font-size: 24px;
  margin: 0 0 15px 0;
  font-weight: bold;
}

/* FIX: Đè màu chữ tối cố định lên style mặc định của template */
.popup-text {
  font-size: 18px !important;
  color: #2c3e50 !important; 
  margin: 15px 0 30px 0;
}

/* FIX: Làm nổi bật tên quà tặng bằng màu đỏ thương hiệu */
.prize-highlight {
  color: #dd2c00 !important;
  font-weight: bold;
  font-size: 20px;
  display: inline-block;
  margin-left: 4px;
}

.popup-btn {
  background-color: #003399 !important;
  color: #ffffff !important;
  border: none;
  padding: 12px 30px;
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.2s;
  width: 100%;
}

.popup-btn:hover {
  background-color: #002266 !important;
}

/* --- RESPONSIVE MOBILE --- */
@media (max-width: 600px) {
  .gift-content {
    top: 14px;
    width: 90px;
  }
  
 .gift-name {
    font-size: 12px;
    margin-bottom: 4px;
    max-width: 80px;
    height: 32px;
  }

  .gift-icon {
    width: 65px;
    height: 65px;
  }

  .spin-button {
    width: 65px;
    height: 65px;
    font-size: 15px;
    border-width: 3px;
  }

  .wheel-pointer {
    top: -15px;
    border-left: 15px solid transparent;
    border-right: 15px solid transparent;
    border-top: 25px solid #dd2c00;
  }
}
</style>