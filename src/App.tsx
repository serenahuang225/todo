import React, { useState, useEffect } from 'react';
import './App.css';
import './styles/utilities.css';
import TodoList from './components/TodoList';
import FilterTabs from './components/FilterTabs';
import AddTodoForm from './components/AddTodoForm';
import Settings from './components/Settings';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  timeEstimate?: number; // in minutes
}

interface AppSettings {
  listName: string;
  primaryColor: string;
  font: string;
  audioEnabled: boolean;
  showProgressBar: boolean;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'done'>('all');
  const [draggedTodo, setDraggedTodo] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [lastDragOverIndex, setLastDragOverIndex] = useState<number | null>(null);
  const [settings, setSettings] = useState<AppSettings>({
    listName: "Serena's To-Do List",
    primaryColor: '#85ce92',
    font: 'Arial, Helvetica, sans-serif',
    audioEnabled: true,
    showProgressBar: true
  });
  const [showSettings, setShowSettings] = useState(false);

  // Load todos and settings from localStorage on component mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    const savedSettings = localStorage.getItem('settings');
    
    if (savedTodos) {
      const parsedTodos = JSON.parse(savedTodos).map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt)
      }));
      setTodos(parsedTodos);
    }
    
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      setSettings(parsedSettings);
      // Apply the primary color
      document.documentElement.style.setProperty('--color-primary', parsedSettings.primaryColor);
      // Apply the shadow color based on the primary color
      const shadowColor = parsedSettings.primaryColor + '66'; // Add 40% opacity (66 in hex)
      document.documentElement.style.setProperty('--color-shadow-primary', shadowColor);
      // Apply the font
      if (parsedSettings.font) {
        document.documentElement.style.setProperty('--font-family', parsedSettings.font);
      }
      // Set the page title
      document.title = parsedSettings.listName;
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Save settings to localStorage whenever settings change
  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [settings]);

  const addTodo = (text: string) => {
    // Parse time estimate from parentheses (e.g., "Task (30 min)" = 30 minutes, "Task (1 hour)" = 60 minutes)
    const timeMatch = text.match(/\((\d+)\s*(min|minute|minutes|hour|hours|hr|hrs)\)/i);
    let timeEstimate: number | undefined;
    let cleanText = text;
    
    if (timeMatch) {
      const value = parseInt(timeMatch[1]);
      const unit = timeMatch[2].toLowerCase();
      
      if (unit.includes('hour') || unit.includes('hr')) {
        timeEstimate = value * 60; // Convert hours to minutes
      } else {
        timeEstimate = value; // Already in minutes
      }
      
      cleanText = text.replace(/\(\d+\s*(min|minute|minutes|hour|hours|hr|hrs)\)/i, '').trim();
    }
    
    const todo: Todo = {
      id: Date.now().toString(),
      text: cleanText,
      completed: false,
      createdAt: new Date(),
      timeEstimate
    };
    setTodos([...todos, todo]);

    if (settings.audioEnabled) {
      const drop = new Audio('data:audio/wav;base64,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')
      drop.volume = 0.4;
      drop.play().catch(() => {
        // Silently fail if audio can't play (user might have blocked autoplay)
      });
    }
  };

  const toggleTodo = (id: string) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    
    // Check if this todo is being completed (not uncompleted)
    const todo = todos.find(t => t.id === id);
    if (todo && !todo.completed && settings.audioEnabled) {
      // Play completion sound
      const check = new Audio('data:audio/wav;base64,SUQzAwAAAAAAI1RTU0UAAAAPAAAATGF2ZjU4LjIwLjEwMAAAAAAAAAAAAAAA//PkAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAOAAAcIAAiIiIiIiIiMzMzMzMzM0RERERERERVVVVVVVVVZmZmZmZmZnd3d3d3d3eIiIiIiIiImZmZmZmZmZmqqqqqqqqqu7u7u7u7u8zMzMzMzMzd3d3d3d3d7u7u7u7u7v////////8AAAAATGF2ZgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHCAL+p/4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//PkZLw2uhceAM7sAAAAA0gBgAAA9/CyIkLgJPAAWZqFiMKASaAjMrGUx0xCsGTGMGB0x1O1Ppi+5DkqruWrH7kuX/weVjACFysLQJFkgCFF9S+xhYUJGIAChIWUZQDIBQcQKJIBUAqiaAX1E0Aq7PbI2ds67/Xe2Vsi713rsbOgT9AKokokgHBggDBAxERBggDBAxERMQECwIGIiJiAgWBAGiKAVAKokowowoz4OIlEkAyiSjPg0Q9RNyFV4Ochy3Icpy3JgyDoMgz/g6DYOg//8xYWCwsYODmDAynRg4OFgYrBisHDAwrBgwPMGBkxFPpiemP///qdpipjf6YqnSnlPqdemIGBqnvU7U7TETYxdNAQ06ABjWjHKy4YGAxlwuGOx2GJswsFjLiADEwZcdQXN5m83mKUCYHC5m8DhgPMdAY0CozC4pMLjsyaBgwoGKQOWAMfa4WGProxhguOFx0xlOlOkxFOww4xhvC45jjhccLjFa4YYYwxfkv0bEwCUL8iMoRlNlQIlY6Y4XHTHTE9TtMdMcxlisYZCMIIYCGrAhgZMMw04TQqGZpoQMNWKrBYYNQMZYLDpjmMMWBjGWOgZMY6Fgw8sLnSuY44XGMYZTwWGDLAwzww8LjmOOp9//PkZNE1fgsgAO5kAAAAA0gBwAAATsxxwuOVjmMMmJ6YqnYWGTG8rHMZYMMCwwZYmKGHlgc1x1Ogw8xxyscrGNccxx1OlPKeLA/qfDDEx1Ogw9MdMZMUxx1OzHHTGU96naYwWG8LjhcYxhlPKeU+Y46nSYinlPJjqdKdBhiYqnaY/pjqd/6nf/6nSnlOlPep5T3qeU7U+p7/9TorGTHTHU+p8LjhhinanRjDKdqfTHTHTGU+mImIp5Tyn1P/6nlP+p0mIp5MdAg2Zs6BFd67kCRZNs6BDy+hfRd4jLbOWQQJF9mzLs8vo2VdjZWyLtbITEFNRTMuMTAwqjZkzMyko3ImDC5lMYmUz+/zC5LA4wMyhcDFxzBgbKLgebNKmDf0s/8wNkfjsko83/AjIWH4zCZOX/PKxNhKLTgeWZdiByxaQrLgRiBGBixRWKRUMWKRXU4MWKAy8DLCwXMuXK2JymBaUDLDFnkVwqeCh82YozwtTkKCisUBS4GXlpwKW9AvyssgUVli0qbBaRNgCFwMsKyxadNgtOZZgBlpaUtKWCxYLeBSxaRNkyxZAsyxdAsCFwIWKy5YLgZaWkAhYtMBCyBQELAZZ5lpXlZYCMAKXAhYsFiwXLSIFlguBsZaYCly//PkZOY2OgciAHN6JgAAA0gAAAAA0qbHlZf/Ay0sMAIxTYNiWNgxA5QsFkCzLFzLlzLlyssWnKy5yiwELJs+mymz6bCBRaRAotOWmLTlpzLFwNi8tMWnLBYsMS0oELgUuWmAkoyxYDLANgAywClwIWLTmXLpsIFIFIFIFlpU2f9ApAr///TZ/0Cv/y0/psIFeWlLSlpy0paUrLIFlZfywXKyyBRaXy06Bf+mygV/+mx6bKBSBXoFFpfTYQKAyzwKWQLQKLSAQsWnLTgUugUVlisugWmygWgWBS6bPlpC0haaTEFNRTMuMTAwqqqqqqqqqqqqqqqqqqqqqiIMLBcCH8rJZpmMHM1mBmSczfxrMYGMTKaDBQRBDcwfMPgsxkRwgLmFzKYXCxktZFYXMLrMwuSwMYjlywIWAjACsSxKCCwSOM+LKxZnrQQVECFqxWAEIAsEDIEQ76WBRxxRWyRWO2fLAsrZmfFlpSwwOUW/02UCk2UCwhc8nit9RorKMssynkVkVzfLMossLIF+WmLTlpwNaWlAi5rrAXAtKWmChZlPBC4Qupwb5ajSjRvPGWUiqFC/CFgoUiomwgUmwgWmyWmA1yBRrrFa5YXQKLGJaVApAoCrgXEsLAeAtIVrga1A//PkZOY2JgkoFHNZaAAAA0gAAAAAoCLFpyxgBrQKuBFi0xWseOBaU11gIuBrjXWAqyBSbKBQGsTZLGBYWLSgeADXoFGtgmwBFv9NlNhAotOBritYCrAa0rXLSIFFaxaUKloqeiqFC1G/CpSKoQopyWC0VFG1OVGvU5U5UbU5U4RVU4UbRWU5U5UbUaUbUa/1OFGlGvU5UaLBQQoFSwoWiqiupypwiv/qN+pyiv/oqKN+iuo2iqo2iqiqo2gWgWgUgWgX6BabCbCBX+gUmyWlTZLSlp02C0iBf+Wn9AotOgXVTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVIYOMhmQHliJH7PaYPXpWZTXhlNeGU14kTAqKNFqwrAhWZTSIPMdJA0ikCsdGkTIaRiZpCJGZDKaRHRjsdmOx0Y7BxpEymDx0VjozIZTBwOMdg8sDosDtFUIHgUBYQPFGjD4eCoKMCgUxOBCwJv8sAUyMBTEwFLAnMCCcsEcwIBDApGLAEMCCYrAhYAgVKLBajSKijaKqnAQuFClOEVTEFMQQrEOcTzFFMUQrF8sTmIKYsxWKYopiClgUxBSxMYs/lYhYFKxTFnOYUxRCucxJvKzy//PkZNIztgsmBHMyugAAA0gAAAAAwd5WcVnmecZ53+Z3ZnHFg8zjyweZ53/5X15WcVnmd0ZxxYPM84zzv/zPPM84+zz7OM88++jP7LB5nnmceZx5WcYopWIVilgU5xTEELExWKYgpWIWJvMUQrFLAvmKIViGIIWJvKxCsUsCmJMYonhFQioGqAxYMQGKEUA1WDEgxMGLwikDRMIqDE4RQGKBomDFBihFAioRQIrBihFQYgMQIpCKQNVhFYRQIoDEwigRUIpwioRWB9wM/CPeEfBnfhHwjwR6B/4M/BnBHwZ6TEFNRTMuMTAwqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqjBAD+MP4P8woCejIdChMnsP4w/0tTIcCgMtoKAxvQQTCgD+MKE/cxXiHDCsDPMKwCcwRwaSsEEwoQQDD+M5MV8KExXgoTCgBBMKAEEwQQoCsKEwoQ/vLAIJggAgGCCFAYIIIJhQh/GCCCCYUAIJgpApFgI0wGwUisFIwGwGisBrzLS0sFpWWGWFpWWmWOpupb5YGzUhorUzUxsxobK1IrG/NSGitA80FALCAVoH+aCgeaAglhB8sIBWgFaD5oKAWEErQCwglhANBQCwgldC//PkZM4zLgUYAHt0ngAAA0gAAAAAWKEsIBWglhAK0ArQSuh//K0DzQEDzQEAsIBoKD/+aCgFhA/zQEEsIBoKB5YQf//LCAaAgeaCgf5WglhALCAaCgFaAWEDytAK0ArQCtBNBQSxQlaAaCgmgoJWg/5WgHQoBoNAaAgldAaCglhBLCAVoJYQCtB8sIBWgmgoPmgoBYQfLCAWEDytB/zQUArQAODACMEIwAZAhGBhGB4Rg8GQOEYH/8DgQeEYIHAg4RgwjBBkDBkCEYP4HAg/BkD8GQfCMCEYIMgfwODA4MgVTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVOBRGMFB3NDVuM20MMqUMMdnTM2jaMqR3MFBHMRhGMFSpLAjlYjmCgKGIwKmIwKFgdiwVBgqVJgoI5goChgoO5lIxlShWVMoUOP2NcINeILAkxC81y8sCSwAKzpWAMCAMCBLAEsADEiCwJLAgxIgxAnywIMQJ8sFDKxisr5YK+WCpYKGVKFgoVlSwUKypWU/ysoWCpWULEcyhQrKlgp/mUK+WChWUKyhlShYKmIEm//PkZK4vLgkaAHdUbgAAA0gAAAAAuEla8xC8xK414nysSYkQYgSYgSViSwIK15iBBWJhErCJUGFIMKwMqUhEoDCkIlQiUhEqDCgRKAZUoBlCkIlQMoVCJQIlAiUCJQIlIMKAwqESmDCkDKRwZHAyhUDjFQMoVCJUIlQOMV/4MKgZQqDCoMKgwqESgMKwYVBhUIlQYVhErBgkDECQiJBggGCQMSJgYgSBiBIMXQMQIAxIgDEiAiJ/CIkDECAMQI///CJUGFYRK+ESvhEqDCkIlPwMqU4RK/CJXwiVBhT/4RKqTEFNRTMuMTAwqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqoFhslkGL2SYvPRkdUGdm0c+IxhU7nDSOVhQyOFTCp2MKHYsAEwCASsdmYzGYjEZmNRmAQCaTLJjsOmWR2ZHIxWdjI53MjhUsBXzI5HMjkfzCpHMjkcrE6iZWETCIRBoRQDqJFgE+WASYJBPlYIMEi8xeCSuANi//PkZHYoKfckYHMQrAAAA0gAAAAAgGB4EA6AZRlAIowgE8sQK4f4NiDxoBPUTNKSwgrR5pT/mlJYQWEmlJWksJLCPK0lhBWj///8rR5pSaUlaSwH///LADADywDywAwA/ysH+WAnWpXQ6U8618sVOtf/zrXzpTzrU61//K6lihXQwhKwlgBYB/mHp9CWAGABgB5WEwAMIDAArAVg8sAMAfKwFYCwH1E8PKHlhZHDyeHmh5A8geULIw8+Hl+HlDz//CL4MfgxhEAwAwBgDDA1wNQNQNQNQiAxBgDDBiDH/gwqTEFNRTMuMTAwqqqqAhiBDEzAwMWMDFxYCJQEZTsxYCGBpZgBi0xYxAkyZiLGYCxi8yaWynZ8p2Z/GsiWcZf50yZGMUwVmQxiSgMLjTBKMlH4CM02aMTGJKM/EorGJhZMAZ+FYXQKAwsLAW8ILqNBVmbOOEZjtszZHkVTt2wh+cc8Yo8FWYSPMWyNkLU5MWLM+LRWUaLB5RoIKmLFKcBBYrPKNhD4KszPizFCys+EPTPHgguVijFHkVywLCp8sClOCsWFRZixYUFBQUisiqYsWioo0ioYpkFBaKijfhUWpyioYoUpyEZDPn1GiwLM+zUaMUyCh8rPqNlg+gUBC4FL//PkZPM31g0uAG+aVgAAA0gAAAAAgQsbBgVlwMtMuxLTAQscuWBJRsS5actKVlkCwKWAyxNgCFi0xac2BZApAtNkrLIF+BlgGXoFemx/lZctP6bPgZeWkTZ9NhAtNlThFZFT1OFGlGvCotRpRpTlFRRtTlFdTlTj0V1OVG0VvU4RXU5UbUbUaUaU49Tj/U4RXRX9Rv1G0V0VEV1OEV0V/RUKxRYFIrKceWBSK6KwQURVUaRWCgtFdTn1GisWEPwoeCHqKyjanCjSK/qcBUWpyiv//6KqKiKnqcepyip6KijVAxKFYLFpywSJh2Mph2B5l4HZgeB5h2Bxh0MpjIB5WBxmcAhiOE5hONJiOIxgINJhMApkiy5onDJrWtRokiZYGQyRRMwOGUyROkw6A4wSKOKJismNGBCw0lhoTYLD+ZgYAQXAxYWBcsGBWlFpSsXAguZiYGYCwGLjFjE0ZHKwQ0doMmJzigUrRzBUY0cnMmBAMWAYsK2UxYWNKFjMBYDFoGYgMWFgWAguZMTGCkxghOZMCGCApWCGjghk4KWCYsIxWCGTghkxMWFkCjWW8Crmusay5acDXpslpQIsWn8rXQKLAhWKWBCwIYghYELE5WIYk5YEMUUsCFYhWKYgpiim//PkZP83fgs0AHd5ehy70UQAUYb0KKYopYEKxDEFMUQxBDFFKxTEEKxfLExzimIKVznMJ5iilYhiiFgQrFMQUxBP8rOLBxYOLBxYO8sH/5nnlZxWf/+Vn///////5YFKxTFFMUXysT/KxPKxSwIYgv+Vi+VilgTysX/8rE/ywL5WJ6bKBf+mwmyWmTY9Av/QLQL8CLemwWlTZTYQLA14EXA1xaZAv02S0ibHlpS06bPlpy0nlhctOWmTZTY//9Av02PTYQLQLLTJsIFIFpsoF+gV//5RIJ+Iwo57TNMzYTv9oiOhhSkf36/lsvfcPrnlZhwc5X+M2RCKHQNnaoR/c4tPdj/4mUJDppCwg1sSx4meRSYSuhnDSnxPukJ4UzP4n5ybnwXJEc0JCfSi4h+WiHwtz+m6U/hWI577sLYUUcOB+XL4gWrMicIwEQVMYAQtVfdHksBYUCjCwox8KLAUEC5WHmHBxhx2Y2NHGKZWNFY2V789bPWyxsKqNaywtTkrWVqVMYQNVav4cHwi3+pwWFhVSnPqNIrqceisiqpwEWUahHCNAN8IgIwRARwDdwDfCMEcIkI0A3gDegG9hagtIuC4A9C+Lwui8LuLovRcF/C04vYuC6LgvhaBcC0BaxdC//PkZJshbglGAG8NaBkDiYQMEEb90BGCMESEbCMEYIkIkIwBuBHCNhHwj+I0M4jUZxn+IyOg6DMOozRGcRqM4zR0GcdRmEaHSOozDOOozDoOozjoOojERkRodYzDOOkdR0jNF74uxe/+Lwv4vxcF4X4WrFwXwtPi4L4Wri9F3C1fi8Fpi9u7u/szLorikR6dz/tT/9TiBCzanvzIv5/75GS91M2RjyQOJUqP9ZYrEUiZZmTklpiyeBixAHAMABg2oJZL+UI6f77oliU++ZPklcJyViRxHxTI3TgLTf/miISHLfs/p/BDTH5qTEFNRSwL+BUoDF4GYAKLhUfKwosBZYFy0oEFzFjEzAXMWFzMBcDFpmBiBUs7JLMXFjMEs2RlAgsZiyGYshmIsBRY2V+NlMDFxdNhAtNgCLlpUCywseKwGuLSpsIFgXA11iwsBrk2U2S0wGuLTARcCrIFFa5aVAtNgrXQLLC5rLlpv8tMgWmwBVi0xaVAtAtNhNlApNlNhAstL/oFpsJspsJslpU2PQK9NlApNlApNlAotKWlQLTYLTeWm8tMgWgUmygX5rrIFlpSwsmwWF02EC/9AotMmz6BZaVApNlNj02ECy06bH+AB0AD0CyBY///wAO8C1gW//PkZPImEgcwAG8tjiNUCZzqpSjcALIFoADsADsCwBbAtgWALeBbAtQLQFr+EeEf/wiQjBE/hE+AbwBuwjwjwj/AtgWALIFrAsQLIFr8C3gWIAHSCAIyDN8ItuEd0GbvCLaDJ/CO/hHfBm7wZP4M3QZuhHd8GTwZPCM/hHf/gc6f8GT//gzfCO7+DN0GbvhHf4R3f8I7+DN2DN4M34M3eEd8Gbvgzd/Bm7+DN/+Ed/wZvgzdCO8Gb4M3/8Gb/Bm/4M3AzeEd/Bm7//+DN3wZu/4RnhGfgyf/hGfgycEZ3Bk6OjyDVVUsUR0RGdFRmxcpqiqZcEm9KpYoywEmXKphASYQXmEBBWReZGRGR8h0ZEfKxFgjMVdzFUc3cVN32jFBQrFfMUdjFRU0YVLAoZGRmR0RkZGWCMyIiNjojYiMsERkZEWCMrIjYyI2IjK2MsEZWxFZGZERlgiMjIjIyIyMiMjYisjMgjzIJKyDIuLBBYIMm47yDIvMgnzIJLBJkX+WCTIJLBBkEGSQVkFggrIMADywAYIBggmAB5ggFYP+YAJYA8rA8yCSwQWCSsgyCf/ysjysgySf8rIMkn/KyCwCYABYBMFwsAf/lYJgglgEsAGCB/lYBWD/mACVgFgErABh//PkZP8q7gUYAG8wuCUcDZgApmgkCKDAIgRYRAYhEgw4MQYBE4RAY4McIsDHBj/BgDAGIMIGOBoDAIoGIMPwYYMQMfCKDDBjBj4MQY8IuEXhEDy4eSFkGHmCyIPIFkIeaHmhZEHnw8oWQh5sPPhFuDJ0GTyvfyvfyxue+8I74M3eBz5/Bk+EZ0GTgZO/Bm//gzdCO6DN+DNwM3YM3QZuBm74R3/gzf8I7vhHeEd2B7t0I74M3eDN3Bm/CO7gzfwZv+DN34M3wZuwju/8GbvhHdgzfgzf8GbvwZPwjPhGd4MnAydwjP4Rn8Iz//Bm8Gbv/+DN3hHd//4R3hHf/4R3/Bm6P9WEyqezdxUMEa0yoojPSjMqHsyoLjBAvMEC4xeCSsqFYGDAYGA0xcLzFwIMElQxcezF4IKwSZ7KhlUXGLlGYuF5ghRlZUK15r1xr15YElYg6oksLj9VTXiPK15Yqla4xNQrElgQWBJiBPla/zEriwuKxJrhJiF5iF5iF/lgQWBJYElYgxAkrXGJE+WBBYEFYkrEGIElgR5YEeViSwJMQIMSIMSJKxH/A0BgEUGAGARAYwiwMQigwAxBgBqEQIoMIGgRIRYRQYBE/hFhECLCKBgEWBjgwgwCKDADH8GP//PkZN4orgcUAHNQehxDpTQACEY9BgEQImETgY4RfCIEWHlDzBZEHkDzh54eYPOHlh5QsgCyLDyQsiCyOHkDyQ8oeQPMFkUPIHmhFCJgw/gYwNIMIMP//DFAlQlQYrDFAYqE1iVhigTQTSGK4YrE0iaiVCVxNRKxNQxWJXJ+mSGU0hXRgYwVhPLWl0uPdmDMvP2HLlLxUP0Y41XS3oYMKzQ2ht5VfDRlKXqwH6qzND8mLz1I1Ygx9JjgpWqr00AgQrMst1u2skrSnM1t4crMUxY1UjssOcFH9R+XKSsZiietMNRBSYkVohP+4yrLVTaQXTMKEzgy2xvTChG8M5gKAxXg/zFfBBMV4KEw/goTBAG8MP8KAw/wQTCgFfLAIJggAgmCAFAVhQmFACAYIAIBhQEOmK+FCYIIfx0P8WKA0H/LH8WKE6BANAQCugLCCaDQmgfx0CCf/QFhANBQDoaA6ChLCAVoBYQSwglhAOhQDQKArQTQEE0ChOgQStAK6AsIJ0CCaDQHQoH+aAgGgIJoCAWEErQTQUEsIBYQStBK0DywgeaCgFaD5YQStAK0E0ChNAQPOgQQODABkAGQAjBCMEDgwYMgcGQAZABkEGQMIrQitA1i0DWrQYtCKyBrVoH0')

      check.volume = 0.4;
      check.play().catch(() => {
        // Silently fail if audio can't play (user might have blocked autoplay)
      });
    }
    
    setTodos(updatedTodos);
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));

    if (settings.audioEnabled) {
      const x = new Audio('data:audio/wav;base64,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')
      x.volume = 0.4;
      x.play().catch(() => {
        // Silently fail if audio can't play (user might have blocked autoplay)
      });
    }
  };

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, todoId: string) => {
    setDraggedTodo(todoId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedTodo !== null) {
      setDragOverIndex(index);
      setLastDragOverIndex(index);
    }

    console.log('DRAG OVER INDEX:', index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    console.log('DRAG END CALLED!');
    console.log('LAST DRAG OVER INDEX:', lastDragOverIndex);
    
    // Use the last drag over index as the drop position
    if (lastDragOverIndex !== null && draggedTodo) {
      console.log('Processing drop at index:', lastDragOverIndex);
      handleDropLogic(lastDragOverIndex);
    }
    
    setDraggedTodo(null);
    setDragOverIndex(null);
    setLastDragOverIndex(null);
  };

  const handleDropLogic = (dropIndex: number) => {
    console.log('DROP LOGIC CALLED!', { draggedTodo, dropIndex });
    
    if (!draggedTodo) {
      return;
    }

    const draggedIndex = filteredTodos.findIndex(todo => todo.id === draggedTodo);
    console.log('Dragged index in filtered:', draggedIndex);
    
    if (draggedIndex !== -1) {
      // Create new array with the dragged item moved to the new position
      const newTodos = [...todos];
      const draggedOriginalIndex = todos.findIndex(todo => todo.id === draggedTodo);
      console.log('Dragged original index:', draggedOriginalIndex);
      
      if (draggedOriginalIndex !== -1) {
        const [movedItem] = newTodos.splice(draggedOriginalIndex, 1);
        
        // Calculate the target position in the original todos array
        let targetOriginalIndex = 0;
        
        if (dropIndex === 0) {
          // Dropping at the beginning
          targetOriginalIndex = 0;
        } else if (dropIndex >= filteredTodos.length) {
          // Dropping at the end
          targetOriginalIndex = todos.length;
        } else {
          // Dropping between items
          const targetTodo = filteredTodos[dropIndex];
          targetOriginalIndex = todos.findIndex(todo => todo.id === targetTodo.id);
        }
        
        console.log('Target original index:', targetOriginalIndex);
        
        // Insert the moved item at the correct position
        if (targetOriginalIndex !== -1) {
          // Adjust index if we're moving an item from before the target to after it
          const adjustedIndex = draggedOriginalIndex < targetOriginalIndex ? targetOriginalIndex - 1 : targetOriginalIndex;
          console.log('Adjusted index:', adjustedIndex);
          newTodos.splice(adjustedIndex, 0, movedItem);
        } else {
          // Fallback: add to the end
          console.log('Adding to end');
          newTodos.push(movedItem);
        }
        
        console.log('New todos:', newTodos.map(t => t.text));
        setTodos(newTodos);

        if (settings.audioEnabled) {
          const drop = new Audio('data:audio/wav;base64,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')
          drop.volume = 0.4;
          drop.play().catch(() => {
            // Silently fail if audio can't play (user might have blocked autoplay)
          });
        }
      }
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'done') return todo.completed;
    return true;
  });

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  // Calculate time estimates
  const totalTime = todos.reduce((sum, todo) => sum + (todo.timeEstimate || 0), 0);
  const completedTime = completedTodos.reduce((sum, todo) => sum + (todo.timeEstimate || 0), 0);
  const progressPercentage = totalTime > 0 ? (completedTime / totalTime) * 100 : 0;

  // Format time display
  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} minutes`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      if (remainingMinutes === 0) {
        return `${hours} hour${hours > 1 ? 's' : ''}`;
      } else {
        return `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}`;
      }
    }
  };

  return (
    <div className="app">
      <div className="settings-button" onClick={() => setShowSettings(!showSettings)}>
        ⚙️
      </div>
      
      {showSettings && (
        <Settings
          settings={settings}
          onSettingsChange={setSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
      
      <div className="notebook-header">
        <h1>{settings.listName}</h1>
      </div>

      <div className="notebook">
        <div className="notebook-content">
          <div className="controls-section">
            <div className="controls-section-inner-red"/>
            <div className="controls-section-inner-content">
              <AddTodoForm onAdd={addTodo} />
              <FilterTabs
                filter={filter}
                todosCount={todos.length}
                activeCount={activeTodos.length}
                completedCount={completedTodos.length}
                onFilterChange={setFilter}
              />
            </div>
            <div className="controls-section-inner"/>
          </div>

          <div className="todo-list">
            <TodoList
              todos={filteredTodos}
              draggedTodo={draggedTodo}
              dragOverIndex={dragOverIndex}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            />
          </div>

          {completedTodos.length > 0 && (
            <div className="clear-completed">
              <button onClick={clearCompleted} className="clear-btn">
                Clear completed
              </button>
            </div>
          )}

          {/* Progress bar */}
          {totalTime > 0 && settings.showProgressBar && (
            <div className="progress-section">
              <div className="progress-info">
                <span className="progress-text">
                  {formatTime(completedTime)} / {formatTime(totalTime)} completed
                </span>
                <span className="progress-percentage">
                  {Math.round(progressPercentage)}%
                </span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
