const typeEnum = {
  types: [
    { value: 'feat', name: 'feat:     Новые функции' },
    { value: 'fix', name: 'fix:      Исправлен баг' },
    { value: 'upd', name: 'upd:      Обновление функции' },
    { value: 'docs', name: 'docs:     Изменения в документации' },
    { value: 'release', name: 'release:     Новая версия' },
    { value: 'deprecated', name: 'deprecated:      Отмена какой-либо функции/компонента' },
    {
      value: 'style',
      name: 'style:    Изменения, которые не изменяют функцию кода (например, удаление пробелов, форматирование, удаление точек с запятой в конце и т.д.)',
    },
    {
      value: 'refactor',
      name: 'refactor: Переработан код, но не содержит исправления ошибок и дополнения функций',
    },
    {
      value: 'perf',
      name: 'perf:     Оптимизация производительности',
    },
    { value: 'test', name: 'test:     Добавление и изменение тестов' },
    {
      value: 'build',
      name: 'build:    Изменения процесса сборки и внешних зависимостей, такие как обновление пакета npm и изменение конфигурации vite',
    },
    { value: 'ci', name: 'ci:       Измененная конфигурация и сценарий CI' },
    {
      value: 'chore',
      name: 'chore:    Изменения в процессе сборки или вспомогательных инструментах и библиотеках, которые не влияют на другие операции с исходными файлами и тестами',
    },
    { value: 'revert', name: 'revert:   Откат назад (к commit-у)' },
    { value: 'core', name: 'core:   Изменено ядро приложения' },
  ],
  scopes: [
    // Если вы выберете пользовательский, вам будет предложено ввести пользовательскую область позже. Вы также можете установить этот элемент без его установки, а затем установить для allowCustomScopes значение true.
    [
      'custom',
      'Ничего из следующего? Я хочу настроить или нажать enter, чтобы пропустить этот пункт',
    ],
    ['components', 'Компонент'],
    ['views', 'Страницы'],
    ['utils', 'Инструмент'],
    ['apis', 'API'],
    ['layout', 'Layout'],
    ['styles', 'Стиль'],
    ['deps', 'Зависимость'],
    ['other', 'Другое'],
  ].map(([value, description]) => ({
    value,
    name: `${value.padEnd(30)} (${description})`,
  })),

  // allowTicketNumber: false,
  // isTicketNumberRequired: false,
  // ticketNumberPrefix: 'TICKET-',
  // ticketNumberRegExp: '\\d{1,5}',

  // Установить тип области, например для 'fix'
  /*
    scopeOverrides: {
      fix: [
        { name: 'merge' },
        { name: 'style' },
        { name: 'e2eTest' },
        { name: 'unitTest' }
      ]
    },
   */
  // Перезаписать запрошенную информацию
  messages: {
    type: 'Ошибка в типе！\nВыберите тип:',
    scope: '\nВыберите область действия (scope):',
    customScope: 'Введите пользовательскую область (scope):',
    subject: 'Заполните краткое и подробное описание:\n',
    body: 'Чтобы добавить более подробное описание, вы можете прикрепить описание новых функций, ссылки на ошибки и ссылки на скриншоты (необязательно).Перенос строк с помощью "|"\n',
    breaking: 'Перечислите основные изменения, связанные с несовместимостью (необязательно):\n',
    footer:
      'Перечислите закрытые проблемы (необязательно) для всех изменений. Например: #31, #34:\n',
    confirmCommit: 'Подтвердить commit?',
  },

  // Следует ли разрешить пользовательское заполнение области, если установлено значение true, будут автоматически добавлены два типа областей [{name: "empty", value: false}, {name: "custom", value: "custom"}]
  // allowCustomScopes: true,
  allowBreakingChanges: ['feat', 'fix'],
  // Пропустить вопросы
  // skipQuestions: [],

  // Предельная длина темы
  subjectLimit: 100,
  // breaklineChar: '|', // Разделитель
  // footerPrefix : 'ISSUES CLOSED:'
  // askForBreakingChangeFirst : true,
};

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-leading-blank': [1, 'always'],
    'footer-leading-blank': [1, 'always'],
    'header-max-length': [2, 'always', 120],
    'scope-case': [2, 'always', 'lower-case'],
    'subject-case': [2, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'type-enum': [2, 'always', typeEnum.types.map((i) => i.value)],
  },
};
