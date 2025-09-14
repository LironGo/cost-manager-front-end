# Cost Manager Frontend

A comprehensive personal expense tracking application built with React and Material-UI. Track your daily expenses, generate detailed reports, and visualize your spending patterns with interactive charts.

## 🚀 Features

### 💰 Expense Management
- **Add Cost Items**: Record expenses with amount, currency, category, and description
- **Multi-Currency Support**: Track expenses in USD, ILS, GBP, and EURO
- **Category Organization**: Organize expenses into predefined categories (Food, Transportation, Entertainment, etc.)
- **Automatic Date Tracking**: Expenses are automatically timestamped when added

### 📊 Reporting & Analytics
- **Monthly Reports**: Generate detailed reports for any month and year
- **Interactive Charts**: 
  - **Pie Chart**: Visualize spending breakdown by category
  - **Bar Chart**: Compare monthly spending across a year
- **Currency Conversion**: View reports in your preferred currency with real-time exchange rates
- **Data Export**: All data is stored locally using IndexedDB

### ⚙️ Settings & Configuration
- **Exchange Rate API**: Configurable exchange rate service
- **Offline Support**: Works without internet connection using cached exchange rates
- **Responsive Design**: Optimized for desktop and mobile devices

## 🛠️ Technology Stack

- **Frontend**: React 18.2.0
- **UI Framework**: Material-UI (MUI) v7.3.2
- **Charts**: Recharts v3.1.2
- **Database**: IndexedDB (client-side storage)
- **Build Tool**: Create React App
- **Node Version**: 20.x

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cost-manager-front-end
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🚀 Available Scripts

### `npm start`
Runs the app in development mode. The page will reload when you make changes and show any lint errors in the console.

### `npm test`
Launches the test runner in interactive watch mode. See the [running tests documentation](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`
Builds the app for production to the `build` folder. The build is optimized and minified for the best performance. Your app is ready to be deployed!

### `npm run eject`
**⚠️ Warning: This is a one-way operation!**

If you need more control over the build configuration, you can eject. This will copy all configuration files and dependencies into your project, giving you full control over webpack, Babel, ESLint, etc.

## 📱 Usage Guide

### Adding Expenses
1. Navigate to the "Add Cost" tab
2. Fill in the expense details:
   - **Sum**: Enter the amount spent
   - **Currency**: Select from USD, ILS, GBP, or EURO
   - **Category**: Choose from predefined categories
   - **Description**: Add a brief description
3. Click "Add Cost Item" to save

### Generating Reports
1. Go to the "Monthly Report" tab
2. Select the year, month, and preferred currency
3. Click "Generate Report" to view detailed expense breakdown
4. The report shows total spending and individual expense items

### Viewing Charts
- **Pie Chart**: Select year, month, and currency to see spending by category
- **Bar Chart**: Choose a year and currency to compare monthly totals

### Configuring Settings
1. Navigate to the "Settings" tab
2. Configure the exchange rate API URL if needed
3. Settings are automatically saved to localStorage

## 🗄️ Data Storage

The application uses **IndexedDB** for client-side storage, which means:
- ✅ All data is stored locally in your browser
- ✅ No server required - works completely offline
- ✅ Data persists between browser sessions
- ✅ Fast access to your expense data

## 🌐 Currency Support

The app supports real-time currency conversion for:
- **USD** (US Dollar)
- **ILS** (Israeli Shekel)
- **GBP** (British Pound)
- **EURO** (Euro)

Exchange rates are fetched from configurable APIs and cached for offline use.

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── AddCostForm.js   # Expense input form
│   ├── MonthlyReport.js # Report generation
│   ├── Settings.js      # Configuration panel
│   └── FeedbackSnackbar.js # User notifications
├── charts/              # Chart components
│   ├── PieChart.js      # Category breakdown chart
│   └── BarChart.js      # Monthly comparison chart
├── services/            # External services
│   └── currencyService.js # Exchange rate handling
├── utils/               # Utility functions
│   └── idb.js          # IndexedDB operations
└── App.js              # Main application component
```

## 🔧 Configuration

### Exchange Rate API
The app uses a configurable exchange rate API. Default endpoint:
```
https://api.exchangerate-api.com/v4/latest/USD
```

You can change this in the Settings tab to use a different API provider.

### Supported API Formats
The currency service supports multiple API response formats:
- `{ rates: { USD, GBP, EUR, ILS } }`
- `{ conversion_rates: { USD, GBP, EUR, ILS } }`
- `{ conversions: { USD: { USD, GBP, EUR, ILS } } }`

## 🚀 Deployment

### Production Build
```bash
npm run build
```

This creates an optimized production build in the `build` folder.

### Deployment Options
- **Static Hosting**: Deploy the `build` folder to any static hosting service
- **Netlify**: Connect your repository for automatic deployments
- **Vercel**: Deploy with zero configuration
- **GitHub Pages**: Host directly from your repository

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the browser console for error messages
2. Ensure you're using Node.js version 20.x
3. Try clearing your browser's IndexedDB storage
4. Open an issue in the repository

## 🔮 Future Enhancements

- [ ] Data export/import functionality
- [ ] Budget tracking and alerts
- [ ] Recurring expense management
- [ ] Receipt photo attachments
- [ ] Multi-user support
- [ ] Advanced filtering and search
- [ ] Expense trends and predictions
