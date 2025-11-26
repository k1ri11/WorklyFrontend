WorklyFrontend/
│
├── public/                            # Статические файлы (HTML, favicon)
│
├── src/                               # Исходный код приложения
│   │
│   ├── api/                           # Конфигурация API (axios, endpoints)
│   │
│   ├── components/                    # Переиспользуемые компоненты
│   │   ├── Header/                    # Компонент шапки сайта
│   │   └── ui/                        # UI-компоненты (Button, Modal, Input и др.)
│   │
│   ├── context/                       # React контексты (AuthContext)
│   │
│   ├── features/                      # Функциональные модули
│   │   ├── auth/                      # Аутентификация
│   │   ├── departments/               # Управление отделами
│   │   ├── positions/                # Должности
│   │   ├── sessions/                  # Рабочие сессии
│   │   ├── statistics/               # Статистика и аналитика
│   │   └── users/                    # Управление пользователями
│   │
│   ├── hooks/                         # Общие React-хуки
│   │
│   ├── pages/                         # Страницы приложения
│   │
│   ├── routes/                        # Маршрутизация (AppRouter, ProtectedRoute)
│   │
│   ├── styles/                        # Глобальные стили
│   │
│   ├── types/                         # TypeScript типы (сгенерированные из OpenAPI)
│   │
│   ├── utils/                         # Утилиты и константы
│   │
│   ├── App.tsx                        # Корневой компонент
│   └── index.tsx                      # Точка входа приложения
│
├── openapi.yaml                       # OpenAPI-спецификация
├── package.json                       # Зависимости проекта
├── tailwind.config.js                 # Конфигурация Tailwind CSS
└── tsconfig.json                      # Конфигурация TypeScript
