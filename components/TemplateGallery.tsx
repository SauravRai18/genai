
import React, { useState } from 'react';
import { Template } from '../types';

interface TemplateGalleryProps {
  onSelect: (template: Template) => void;
}

const templates: Template[] = [
  // 1. Startup & Business
  { id: 'st-1', category: 'Startup', title: 'Mumbai Founder', icon: 'fa-briefcase', prompt: 'Mumbai café, young Indian woman typing on laptop, cinematic warm lighting, smooth zoom-in – Voice: Female Indian English – “Turn your ideas into reality today!”' },
  { id: 'st-2', category: 'Startup', title: 'Bangalore Pitch', icon: 'fa-building-columns', prompt: 'Bangalore co-working space, man presenting to team, bright cinematic light, tracking shot – Voice: Male – “Innovation starts with teamwork!”' },
  { id: 'st-3', category: 'Startup', title: 'Delhi Freelancer', icon: 'fa-house-laptop', prompt: 'Delhi home office, freelancer brainstorming, soft morning light, close-up – Voice: Female – “Your passion drives success!”' },
  { id: 'st-4', category: 'Startup', title: 'Team Sync', icon: 'fa-users-viewfinder', prompt: 'Startup team video call, diverse Indian team collaborating, wide cinematic angle – Voice: Male – “Collaboration is the key!”' },
  { id: 'st-5', category: 'Startup', title: 'Tech Speaker', icon: 'fa-microphone-lines', prompt: 'Tech conference stage, entrepreneur presenting confidently, spotlight cinematic effect – Voice: Male – “Inspire the world with your ideas!”' },
  { id: 'st-6', category: 'Startup', title: 'Coffee Productivity', icon: 'fa-mug-hot', prompt: 'Home desk with laptop, woman sipping coffee, top-down cinematic shot – Voice: Female – “Every small step counts!”' },
  { id: 'st-7', category: 'Startup', title: 'Rooftop Strategy', icon: 'fa-building', prompt: 'Rooftop meeting, young professionals discussing chart, dynamic cinematic lighting – Voice: Male – “Plan smart, achieve more!”' },
  { id: 'st-8', category: 'Startup', title: 'Glass Board Prep', icon: 'fa-chalkboard-user', prompt: 'Office brainstorming, team writing on glass board, soft cinematic light – Voice: Female – “Creativity leads the future!”' },
  { id: 'st-9', category: 'Startup', title: 'App Demo', icon: 'fa-tablet-screen-button', prompt: 'Product demo, man showing app on tablet, cinematic product focus – Voice: Male – “Experience innovation firsthand!”' },
  { id: 'st-10', category: 'Startup', title: 'Night Shift', icon: 'fa-moon', prompt: 'Freelancer night work, woman typing with coffee, soft warm desk light – Voice: Female – “Success comes to those who persist!”' },
  { id: 'st-11', category: 'Startup', title: 'Startup High-Five', icon: 'fa-hand-peace', prompt: 'Startup celebration, team high-five in office, bright cinematic light – Voice: Male – “Every achievement deserves a cheer!”' },
  { id: 'st-12', category: 'Startup', title: 'Investor Pitch', icon: 'fa-money-bill-trend-up', prompt: 'Investor pitch room, entrepreneur presenting idea, cinematic wide-angle – Voice: Female – “Your vision can change the world!”' },

  // 2. Travel & Adventure
  { id: 'tr-1', category: 'Travel', title: 'Jaipur Streets', icon: 'fa-camera-retro', prompt: 'Jaipur Pink City, woman photographing streets, golden hour cinematic light – Voice: Female – “Discover the colors of Rajasthan!”' },
  { id: 'tr-2', category: 'Travel', title: 'Kerala Waters', icon: 'fa-ship', prompt: 'Kerala houseboat, family enjoying river, sunrise cinematic lighting – Voice: Male – “Relax in God’s own country.”' },
  { id: 'tr-3', category: 'Travel', title: 'Himalayan Highs', icon: 'fa-mountain', prompt: 'Himalayan trekking, young man climbing mountain, epic wide-angle slow-motion – Voice: Male – “Adventure awaits the brave!”' },
  { id: 'tr-4', category: 'Travel', title: 'Rishikesh Thrill', icon: 'fa-water', prompt: 'Rishikesh rafting, woman paddling rapids, high-speed cinematic capture – Voice: Female – “Feel the thrill of India’s rivers!”' },
  { id: 'tr-5', category: 'Travel', title: 'Pani Puri Vlog', icon: 'fa-utensils', prompt: 'Mumbai street food, man tasting pani puri, vibrant close-up, motion blur – Voice: Male – “Taste the city’s vibrant flavors!”' },
  { id: 'tr-6', category: 'Travel', title: 'Goa Sunset', icon: 'fa-sun', prompt: 'Goa beach sunset, friends playing volleyball, warm cinematic glow, drone tracking – Voice: Female – “Sunsets and laughter on the beach!”' },
  { id: 'tr-7', category: 'Travel', title: 'Palace History', icon: 'fa-fort-awesome', prompt: 'Jaipur palace tour, woman walking through palace, cinematic depth-of-field – Voice: Male – “Step into royal history.”' },
  { id: 'tr-8', category: 'Travel', title: 'Ladakh Ride', icon: 'fa-motorcycle', prompt: 'Ladakh desert drive, man on motorbike, golden cinematic light, side tracking – Voice: Male – “Ride through breathtaking landscapes!”' },
  { id: 'tr-9', category: 'Travel', title: 'Market Stories', icon: 'fa-shop', prompt: 'Delhi street market, vendor arranging fruits, colorful cinematic lighting – Voice: Female – “Every street tells a story.”' },
  { id: 'tr-10', category: 'Travel', title: 'Serene Estates', icon: 'fa-leaf', prompt: 'Kerala tea plantation, woman picking tea leaves, soft cinematic morning light – Voice: Female – “Experience serene beauty.”' },
  { id: 'tr-11', category: 'Travel', title: 'Andaman Paradise', icon: 'fa-water', prompt: 'Andaman beach kayaking, couple paddling through waves, cinematic sunlight – Voice: Male – “Explore hidden paradises!”' },
  { id: 'tr-12', category: 'Travel', title: 'Varanasi Ghats', icon: 'fa-om', prompt: 'Varanasi ghats sunrise, pilgrims on river boats, cinematic drone shot – Voice: Female – “Witness spiritual serenity!”' },

  // 3. Festivals & Culture
  { id: 'cult-1', category: 'Culture', title: 'Diwali Glow', icon: 'fa-fire', prompt: 'Diwali, children lighting diyas, warm cinematic glow, slow pan – Voice: Female – “Light up your life with joy!”' },
  { id: 'cult-2', category: 'Culture', title: 'Holi Splash', icon: 'fa-palette', prompt: 'Holi, people throwing colors, vibrant slow-motion, close-up – Voice: Male – “Splash your world with happiness!”' },
  { id: 'cult-3', category: 'Culture', title: 'Garba Night', icon: 'fa-music', prompt: 'Navratri, women performing garba, colorful lights, circular tracking – Voice: Female – “Dance to the rhythm of tradition!”' },
  { id: 'cult-4', category: 'Culture', title: 'Ganesh Festival', icon: 'fa-om', prompt: 'Ganesh Chaturthi, devotees carrying idol, cinematic street lights, drone view – Voice: Male – “Experience devotion and culture!”' },
  { id: 'cult-5', category: 'Culture', title: 'Indian Wedding', icon: 'fa-heart', prompt: 'Indian wedding, bride and groom rituals, soft golden lighting, close-up – Voice: Female – “Tradition that lasts a lifetime!”' },
  { id: 'cult-6', category: 'Culture', title: 'Independence Day', icon: 'fa-flag', prompt: 'Independence Day, flag hoisting, crowd cheering, sunrise cinematic – Voice: Male – “Celebrate freedom with pride!”' },
  { id: 'cult-7', category: 'Culture', title: 'Christmas India', icon: 'fa-star', prompt: 'Christmas in India, street decorations, warm festive lights, medium shot – Voice: Female – “Feel the festive spirit!”' },
  { id: 'cult-8', category: 'Culture', title: 'Eid Togetherness', icon: 'fa-moon', prompt: 'Eid festival, family sharing meal, warm indoor cinematic light – Voice: Male – “Celebrate togetherness and joy!”' },
  { id: 'cult-9', category: 'Culture', title: 'Sibling Bond', icon: 'fa-hand-holding-heart', prompt: 'Raksha Bandhan, brother-sister ritual, soft cinematic light – Voice: Female – “Celebrate the bond of siblings!”' },
  { id: 'cult-10', category: 'Culture', title: 'Harvest Success', icon: 'fa-wheat-awn', prompt: 'Pongal harvest, farmers in field, sunrise cinematic, drone shot – Voice: Male – “Celebrate prosperity and tradition!”' },
  { id: 'cult-11', category: 'Culture', title: 'Mehendi Art', icon: 'fa-hand', prompt: 'Karva Chauth, woman applying mehendi, evening cinematic glow – Voice: Female – “Cherish love and devotion!”' },
  { id: 'cult-12', category: 'Culture', title: 'Lohri Fire', icon: 'fa-fire-alt', prompt: 'Lohri, bonfire festival, friends dancing, winter warm cinematic light – Voice: Male – “Celebrate warmth and togetherness!”' },

  // 4. Fitness & Wellness
  { id: 'fit-1', category: 'Fitness', title: 'Morning Jog', icon: 'fa-person-running', prompt: 'Morning jog in Lodhi Gardens, woman running, sunrise cinematic lighting, tracking – Voice: Female – “Start your day full of energy!”' },
  { id: 'fit-2', category: 'Fitness', title: 'Rooftop Zen', icon: 'fa-spa', prompt: 'Rooftop yoga Mumbai, group meditating, soft cinematic glow, top-down – Voice: Male – “Find your inner peace.”' },
  { id: 'fit-3', category: 'Fitness', title: 'Heavy Lifting', icon: 'fa-dumbbell', prompt: 'Gym training, man lifting weights, dramatic shadows, slow-motion – Voice: Male – “Push beyond limits every day.”' },
  { id: 'fit-4', category: 'Fitness', title: 'Tree Meditation', icon: 'fa-tree', prompt: 'Meditation in park, woman under tree, morning light, side camera – Voice: Female – “Breathe, focus, grow.”' },
  { id: 'fit-5', category: 'Fitness', title: 'Marine Cycling', icon: 'fa-bicycle', prompt: 'Cycling along Marine Drive, man cycling, golden hour, side tracking – Voice: Male – “Fitness meets scenic beauty.”' },
  { id: 'fit-6', category: 'Fitness', title: 'Beach Flows', icon: 'fa-water', prompt: 'Beach workout, group doing yoga, cinematic sunrise, wide-angle – Voice: Female – “Move with the waves of life.”' },
  { id: 'fit-7', category: 'Fitness', title: 'HIIT Burn', icon: 'fa-bolt', prompt: 'Home HIIT session, young man exercising, dynamic light, close-up – Voice: Male – “Every rep counts!”' },
  { id: 'fit-8', category: 'Fitness', title: 'Spa Recovery', icon: 'fa-hot-tub-person', prompt: 'Spa/relaxation, candle-lit massage, soft ambient cinematic, overhead – Voice: Female – “Relax and rejuvenate.”' },
  { id: 'fit-9', category: 'Fitness', title: 'Peak Hike', icon: 'fa-mountain-sun', prompt: 'Hiking forest trail, woman climbing hill, cinematic natural light, drone – Voice: Female – “Adventure is therapy for the soul.”' },
  { id: 'fit-10', category: 'Fitness', title: 'Sunset Zen', icon: 'fa-sun', prompt: 'Evening meditation, rooftop sunset, golden cinematic glow – Voice: Male – “Reflect, recharge, renew.”' },

  // 5. Cooking & Food
  { id: 'food-1', category: 'Food', title: 'Chai Masterclass', icon: 'fa-mug-hot', prompt: 'Masala chai tutorial, woman pouring chai, warm kitchen light, close-up – Voice: Female – “Master the art of Indian chai!”' },
  { id: 'food-2', category: 'Food', title: 'Vada Pav Vlog', icon: 'fa-utensils', prompt: 'Street food Mumbai, vendor frying vada pav, vibrant cinematic, slow-motion – Voice: Male – “Taste authentic street flavors!”' },
  { id: 'food-3', category: 'Food', title: 'Laddoo Sweets', icon: 'fa-cookie', prompt: 'Traditional Indian sweets, laddoo preparation, soft kitchen light, top-down – Voice: Female – “Sweeten your life the Indian way!”' },
  { id: 'food-4', category: 'Food', title: 'Spice Focus', icon: 'fa-pepper-hot', prompt: 'Spices & curry, chef stirring pan, cinematic texture focus – Voice: Male – “Discover authentic Indian flavors!”' },
  { id: 'food-5', category: 'Food', title: 'Healthy Indian', icon: 'fa-carrot', prompt: 'Healthy lunch prep, young man chopping vegetables, bright kitchen light – Voice: Female – “Cook smart, eat healthy!”' },
  { id: 'food-6', category: 'Food', title: 'Dosa Flip', icon: 'fa-egg', prompt: 'Idli & dosa breakfast, woman flipping dosa, soft morning cinematic light – Voice: Female – “Start your day with flavor!”' },
  { id: 'food-7', category: 'Food', title: 'Thali Experience', icon: 'fa-plate-wheat', prompt: 'South Indian Thali plating, cinematic overhead, vibrant colors – Voice: Male – “Taste the richness of India!”' },
  { id: 'food-8', category: 'Food', title: 'Kadak Chai', icon: 'fa-mug-saucer', prompt: 'Street tea stall, vendor making chai, cinematic close-up, steam focus – Voice: Female – “Every sip tells a story.”' },
  { id: 'food-9', category: 'Food', title: 'Grand Feast', icon: 'fa-users', prompt: 'Indian festival feast, family enjoying meal, warm indoor cinematic, group shot – Voice: Male – “Celebrate traditions through food!”' },
  { id: 'food-10', category: 'Food', title: 'Roti Kneading', icon: 'fa-bowl-food', prompt: 'Cooking tutorial, man kneading dough, soft cinematic kitchen light – Voice: Female – “Bring flavors to life!”' },

  // 6. Beauty & Lifestyle
  { id: 'bea-1', category: 'Beauty', title: 'Glow Skincare', icon: 'fa-face-smile-beam', prompt: 'Morning skincare routine, woman applying moisturizer, soft cinematic light, close-up – Voice: Female Indian English – “Start your day with self-care.”' },
  { id: 'bea-2', category: 'Beauty', title: 'Sparkle Makeup', icon: 'fa-wand-magic-sparkles', prompt: 'Makeup tutorial, woman applying eye shadow, vibrant cinematic light – Voice: Female – “Unleash your beauty.”' },
  { id: 'bea-3', category: 'Beauty', title: 'Healthy Locks', icon: 'fa-wind', prompt: 'Haircare routine, long hair flowing, woman brushing, cinematic texture light – Voice: Female – “Healthy hair, confident you.”' },
  { id: 'bea-4', category: 'Beauty', title: 'Indo-Western Look', icon: 'fa-shirt', prompt: 'Fashion try-on, woman modeling outfit, runway cinematic lighting – Voice: Female – “Express yourself through style.”' },
  { id: 'bea-5', category: 'Beauty', title: 'Refresh Session', icon: 'fa-spa', prompt: 'Spa/relaxation session, candle-lit massage, soft light – Voice: Female – “Relax, rejuvenate, refresh.”' },
  { id: 'bea-6', category: 'Beauty', title: 'Grooming King', icon: 'fa-user-tie', prompt: 'Evening ritual, man grooming beard, cinematic warm lighting – Voice: Male – “Confidence is key.”' },
  { id: 'bea-7', category: 'Beauty', title: 'Fragrance Drift', icon: 'fa-spray-can-sparkles', prompt: 'Perfume ad, woman spraying fragrance, cinematic close-up – Voice: Female – “Scent that inspires.”' },
  { id: 'bea-8', category: 'Beauty', title: 'Royal Jewels', icon: 'fa-gem', prompt: 'Jewelry display, woman showcasing earrings, soft cinematic glow – Voice: Female – “Elegance in every detail.”' },
  { id: 'bea-9', category: 'Beauty', title: 'Suited Up', icon: 'fa-user-ninja', prompt: 'Outfit transition, man switching suits, cinematic tracking shot – Voice: Male – “Style for every occasion.”' },
  { id: 'bea-10', category: 'Beauty', title: 'Sunny Vlog', icon: 'fa-sun', prompt: 'Lifestyle vlog intro, woman walking street, sunny cinematic light – Voice: Female – “Live life colorfully.”' }
];

const TemplateGallery: React.FC<TemplateGalleryProps> = ({ onSelect }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const categories = ['All', ...Array.from(new Set(templates.map(t => t.category)))];

  const filteredTemplates = selectedCategory === 'All' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  return (
    <div className="space-y-10 pb-20">
      <div className="max-w-2xl">
        <h2 className="text-4xl font-black mb-4 tracking-tight">Master <span className="text-orange-500">Prompt Pack</span></h2>
        <p className="text-slate-400 font-medium leading-relaxed">
          The ultimate collection of 100+ viral presets optimized for the Indian creator market. 
          Each template is a storyboard-ready prompt for 9:16 vertical reels.
        </p>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-6 no-scrollbar sticky top-[73px] z-20 bg-slate-950/80 backdrop-blur-md pt-2">
        {categories.map(cat => (
          <button 
            key={cat} 
            onClick={() => setSelectedCategory(cat)}
            className={`px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest whitespace-nowrap transition-all border ${
              selectedCategory === cat 
                ? 'bg-orange-500 border-orange-400 text-white shadow-lg shadow-orange-900/20' 
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTemplates.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelect(template)}
            className="glass p-8 rounded-[2.5rem] border border-slate-800 hover:border-orange-500/50 transition-all text-left group relative overflow-hidden flex flex-col h-full"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-500/5 to-transparent rounded-full -mr-12 -mt-12 group-hover:bg-orange-500/10 transition-all"></div>
            
            <div className="w-14 h-14 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-500 transition-colors shadow-xl">
              <i className={`fa-solid ${template.icon} text-2xl text-slate-600 group-hover:text-white transition-colors`}></i>
            </div>
            
            <div className="flex-1">
              <p className="text-[10px] text-orange-500 font-black uppercase tracking-[0.2em] mb-2">{template.category}</p>
              <h3 className="text-xl font-black mb-3 text-slate-100">{template.title}</h3>
              <p className="text-sm text-slate-500 font-medium line-clamp-3 leading-relaxed mb-6 italic">
                "{template.prompt}"
              </p>
            </div>
            
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Pro Preset</span>
              <i className="fa-solid fa-arrow-right text-slate-800 group-hover:text-orange-500 group-hover:translate-x-1 transition-all"></i>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TemplateGallery;
