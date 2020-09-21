# React Hooks Study

## 2020.09.21

### - useState의 기본형

```javascript
import React, { useState } from "react";

function App() {
  // const[value, setState] = useState(initial value)
  const [item, setItem] = useState(1);

  const increase = () => setItem(item + 1);
  const decrease = () => setItem(item - 1);

  return (
    <div>
      <h1>The number is : {item}</h1>
      <button onClick={increase}>Increase</button>
      <button onClick={decrease}>Decrease</button>
    </div>
  );
}

export default App;
```

### - useInput과 validator

```javascript
import React, { useState } from "react";

const useInput = (initalValue, validator) => {
  const [value, setValue] = useState(initalValue);
  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    let willUpdate = true;

    if (typeof validator === "function") {
      willUpdate = validator(value);
    }

    if (willUpdate) {
      setValue(value);
    }
  };
  return { value, onChange };
};

const App = () => {
  const maxLen = (value) => value.length <= 10;
  const emailForm = (value) => value.includes("@");
  const name = useInput("Mr.", maxLen);
  const email = useInput("@");
  return (
    <div>
      <h1>Hello!!!</h1>
      <input type="text" {...name} placeholder="Name" />

      <input
        type="text"
        value={email.value}
        onChange={email.onChange}
        placeholder="Email"
      />
    </div>
  );
};

export default App;
```

### - useTabs (사용자가 클릭되는 곳에 따라 변화하는 Hooks)

```javascript
import React, { useState } from "react";

const content = [
  {
    tab: "Section 1",
    content: "I'm the content of the Section 1",
  },
  {
    tab: "Section 2",
    content: "I'm the content of the Section 2",
  },
];

const useTabs = (initialTab, allTabs) => {
  if (!allTabs || !Array.isArray(allTabs)) {
    return;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [currentIndex, setCurrentIndex] = useState(initialTab);
  return {
    currentItem: allTabs[currentIndex],
    changeItem: setCurrentIndex,
  };
};

const App = () => {
  const { currentItem, changeItem } = useTabs(0, content);
  return (
    <div>
      {content.map((section, index) => (
        <button onClick={() => changeItem(index)}>{section.tab}</button>
      ))}
      <div>{currentItem.content}</div>
    </div>
  );
};

export default App;
```

### - useEffect (componentWillUnmount, componentDidMount, componentWillUpdate와 동일한 function )

1. useEffect 안에 function을 넣으면 componentDidMount와 componentDidUpdate 일 때 호출
2. dependency가 존재한다면 componentDidMount 일 때만 호출
3. useEffect에서 return 받은 함수가 componentWillUnMount 때 호출 되는 함수

- useEffect 기본사용법

```javascript
import React, { useState, useEffect } from "react";

const App = () => {
  const sayHello = () => console.log("hello");

  const [number, setNumber] = useState(0);
  const [aNumber, setAnumber] = useState(0);

  //useEffect(function, dependency)
  // 여기서 dependency란 특정한 부분에 업데이트가 되었을 때만 변화를 시키길 원하는 값을 대입
  // componentDidMount 됐을 때만 변화를 주고 싶다면 빈배열을 대입

  //aNumber이 업데이트 될때만 실행
  useEffect(sayHello, [aNumber]);

  return (
    <div>
      <div>Hi</div>
      <button onClick={() => setNumber(number + 1)}>{number}</button>
      <button onClick={() => setAnumber(aNumber + 1)}>{aNumber}</button>
    </div>
  );
};

export default App;
```

### - useTitle (문서의 제목을 Update 시켜주는 Hooks)

```javascript
import React, { useState, useEffect } from "react";

const useTitle = (initialTitle) => {
  const [title, setTitle] = useState(initialTitle);
  const updateTitle = () => {
    const htmlTitle = document.querySelector("title");
    htmlTitle.innerText = title;
  };
  useEffect(updateTitle, [title]);
  return setTitle;
};

const App = () => {
  const titleUpdater = useTitle("Loading ...");
  setTimeout(() => titleUpdater("Home"), 3000);
  return (
    <div>
      <div>Hi</div>
    </div>
  );
};

export default App;
```

### - useClick

- useRef (어떤 대상을 지정하는것 document.getElementById와 비슷함)

```javascript
import React, { useState, useEffect, useRef } from "react";

const useClick = (onClick) => {
  const element = useRef();
  useEffect(() => {
    if (element.current) {
      element.current.addEventListener("click", onClick);
    }
  });
  return element;
};

const App = () => {
  const sayHello = () => console.log("say hello");
  const title = useClick(sayHello);

  return (
    <div className="App">
      <h1 ref={title}>Hi</h1>
    </div>
  );
};

export default App;
```

- useEffect componentWillUnMount 발생 시

```javascript
import React, { useState, useEffect, useRef } from "react";

const useClick = (onClick) => {
  const element = useRef();
  useEffect(() => {
    if (element.current) {
      element.current.addEventListener("click", onClick);
    }
    return () => {
      if (element.current) {
        element.current.removeEventListener("click", onClick);
      }
    };
  }, []);
  return element;
};

const App = () => {
  const sayHello = () => console.log("say hello");
  const title = useClick(sayHello);

  return (
    <div className="App">
      <h1 ref={title}>Hi</h1>
    </div>
  );
};

export default App;
```

- useClick

```javascript
import React, { useState, useEffect, useRef } from "react";

const useClick = (onClick) => {
  if (typeof onClick !== "function") {
    return;
  }

  const element = useRef();
  useEffect(() => {
    if (element.current) {
      element.current.addEventListener("click", onClick);
    }
    return () => {
      if (element.current) {
        element.current.removeEventListener("click", onClick);
      }
    };
  }, []);
  return element;
};

const App = () => {
  const sayHello = () => console.log("say hello");
  const title = useClick(sayHello);

  return (
    <div className="App">
      <h1 ref={title}>Hi</h1>
    </div>
  );
};

export default App;
```

### - useConfirm (사용자가 무언갈 하기전 확인하는 Hooks)

```javascript
import React, { useState, useEffect, useRef } from "react";

const useConfirm = (message = "", onConfirm, onCancel) => {
  if (!onConfirm && typeof onConfirm !== "function") {
    return;
  }
  if (onCancel && typeof onCancel !== "function") {
    return;
  }

  const confirmAction = () => {
    if (window.confirm(message)) {
      onConfirm();
    } else {
      onCancel();
    }
  };
  return confirmAction;
};

const App = () => {
  const deleteWorld = () => console.log("Delete!!!!");
  const abort = () => console.log("Delete Cancel!!");

  const confirmDelete = useConfirm("are you sure?", deleteWorld, abort);
  return (
    <div className="App">
      <button onClick={confirmDelete}>Delete!!</button>
    </div>
  );
};

export default App;
```

### - usePreventLeave (브라우저를 닫을 때 저장이 되지 않았다면 경고를 주는 것)

```javascript
import React, { useState, useEffect, useRef } from "react";

const usePreventLeave = () => {
  const listener = (event) => {
    event.preventDefault();
    event.returnValue = "";
  };
  const enablePrevent = () => window.addEventListener("beforeunload", listener);
  const disablePrevnet = () =>
    window.removeEventListener("beforeunload", listener);

  return { enablePrevent, disablePrevnet };
};

const App = () => {
  const { enablePrevent, disablePrevnet } = usePreventLeave();

  return (
    <div className="App">
      <button onClick={enablePrevent}>Protect</button>
      <button onClick={disablePrevnet}>UnProtect</button>
    </div>
  );
};

export default App;
```

### - useBeforeLeave (탭을 닫을 때 실행되는 함수, 마우스가 페이지를 벗어날 때 호출된다 )

```javascript
import React, { useState, useEffect, useRef } from "react";

const useBeforeLeave = (onBefore) => {
  if (typeof onBefore !== "function") {
    return;
  }

  const handle = (event) => {
    const { clientY } = event;
    if (clientY <= 0) {
      onBefore();
    }
  };
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    document.addEventListener("mouseleave", handle);
    return () => document.removeEventListener("mouseleave", handle);
  }, []);
};

const App = () => {
  const begForLife = () => console.log("Plz dont leave");
  useBeforeLeave(begForLife);
  return (
    <div className="App">
      <h1>Hello</h1>
    </div>
  );
};

export default App;
```

### - useFadeIn (Page가 렌더링 될때 서서히 나타나게 하는 함수)

```javascript
import React, { useState, useEffect, useRef } from "react";

const useFadeIn = (duration = 1, delay = 0) => {
  if (typeof duration !== "number" || typeof delay !== "number") {
    return;
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const element = useRef();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (element.current) {
      const { current } = element;
      current.style.transition = `opacity ${duration}s ease-in-out ${delay}s`;
      current.style.opacity = 1;
    }
  }, []);

  return { ref: element, style: { opacity: 0 } };
};

const App = () => {
  const fadeInH1 = useFadeIn(1, 2);
  const fadeInP = useFadeIn(5, 10);
  return (
    <div className="App">
      <h1 {...fadeInH1}>Hello</h1>
      <p {...fadeInP}>Fall a Sleep!</p>
    </div>
  );
};

export default App;
```

### - useNetwork (Network 상태가 바뀔 때마다 호출되는 함수)
