import React, { useEffect, useMemo, useState } from 'react'
import { styles } from '../assets/dummyStyles.js'
import Navbar from './Navbar.jsx'
import Sidebar from './Sidebar.jsx'
import { ActivityIcon, ArrowDown, ArrowUp, Car, ChevronDown, ChevronUp, Clock, CreditCard, DollarSign, Gift, Home, Info, OutdentIcon, PieChart, PiggyBank, RefreshCcw, ShoppingCart, TrendingUp, Utensils, Zap } from 'lucide-react';
import { Outlet } from 'react-router';
import axios from 'axios';

const API_BASE = "https://expense-manager-backend-lhq1.onrender.com/api";
const CATEGORY_ICONS = {
  Food: <Utensils className="w-4 h-4" />,
  Housing: <Home className="w-4 h-4" />,
  Transport: <Car className="w-4 h-4" />,
  Shopping: <ShoppingCart className="w-4 h-4" />,
  Entertainment: <Gift className="w-4 h-4" />,
  Utilities: <Zap className="w-4 h-4" />,
  Healthcare: <ActivityIcon className="w-4 h-4" />,
  Salary: <ArrowUp className="w-4 h-4" />,
  Freelance: <CreditCard className="w-4 h-4" />,
  Savings: <PiggyBank className="w-4 h-4" />,
};

// To Filter


const filterTransactions = (transactions, frame) => {
  const now = new Date();
  const today = new Date(now).setHours(0, 0, 0, 0);

  switch (frame) {
    case "daily": {
      const endOfDay = new Date(today);
      endOfDay.setHours(23, 59, 59, 999);

      return transactions.filter((t) => {
        const d = new Date(t.date);
        return d >= today && d <= endOfDay;
      });
    }
    case "weekly": {
      const startOfWeek = new Date(today);
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);

      return transactions.filter((t) => {
        const d = new Date(t.date);
        return d >= startOfWeek && d <= endOfWeek;
      });
    }
    case "monthly": {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(now.getDate() - 30);
      thirtyDaysAgo.setHours(0, 0, 0, 0);

      return transactions.filter((t) => {
        const d = new Date(t.date);
        return d >= thirtyDaysAgo && d <= now;
      });
    }
    default:
      return transactions;
  }
};

const safeArrayFromResponse = (res) => {
  const body = res?.data;
  if (!body) return [];
  if (Array.isArray(body)) return body;
  if (Array.isArray(body.data)) return body.data;
  if (Array.isArray(body.incomes)) return body.incomes;
  if (Array.isArray(body.expenses)) return body.expenses;
  if (Array.isArray(body.expense)) return body.expense; // <-- Add this line
  if (Array.isArray(body.income)) return body.income; // <-- Add this line

  return [];
};

const Layout = ({ onLogout, user }) => {
  const [transactions, setTransactions] = useState([]);
  const [timeFrame, setTimeFrame] = useState("monthly");
  const [loading, setLoading] = useState(false);
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [sidebarcollapsed, setSidebarCollapsed] = useState(false);

  // to fetch transactions from server 
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const [incomeRes, expenseRes] = await Promise.all([
        axios.get(`${API_BASE}/income/get`, { headers }),
        axios.get(`${API_BASE}/expense/get`, { headers }),
      ]);

      const incomes = safeArrayFromResponse(incomeRes).map((i) => ({
        ...i,
        type: "income",
      }));
      const expenses = safeArrayFromResponse(expenseRes).map((e) => ({
        ...e,
        type: "expense",
      }));

      console.log("Income API:", incomeRes.data);
      console.log("Expense API:", expenseRes.data);

      console.log("Mapped Income:", incomes);
      console.log("Mapped Expense:", expenses);

      const allTransactions = [...incomes, ...expenses]
        .map((t) => ({
          id: t._id || t.id || t.id_str || Math.random().toString(36).slice(2),
          description: t.description || t.title || t.note || "",
          amount: t.amount != null ? Number(t.amount) : Number(t.value) || 0,
          date: t.date || t.createdAt || new Date().toISOString(),
          category: t.category || t.type || "Other",
          type: t.type,
          raw: t,
        }))
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      setTransactions(allTransactions);
      console.log("Fetched transactions:", allTransactions);
      setLastUpdated(new Date());
    } catch (err) {
      console.error(
        "Failed to fetch transactions",
        err?.response || err.message || err
      );
    } finally {
      setLoading(false);
    }
  };


  // Add Transactions income / expenses

  const addTransaction = async (transaction) => {
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const endpoint =
        transaction.type === "income" ? "income/add" : "expense/add";
      await axios.post(`${API_BASE}/${endpoint}`, transaction, { headers });
      await fetchTransactions();
      return true;
    } catch (err) {
      console.error(
        "Failed to add transaction",
        err?.response || err.message || err
      );
      throw err;
    }
  };


  // Edit transactions 

  const editTransaction = async (id, transaction) => {
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const endpoint =
        transaction.type === "income" ? "income/update" : "expense/update";
      await axios.put(`${API_BASE}/${endpoint}/${id}`, transaction, {
        headers,
      });
      await fetchTransactions();
      return true;
    } catch (err) {
      console.error(
        "Failed to edit transaction",
        err?.response || err.message || err
      );
      throw err;
    }
  };


  //  To delete Transaction

  const deleteTransaction = async (id, type) => {
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const endpoint = type === "income" ? "income/delete" : "expense/delete";
      await axios.delete(`${API_BASE}/${endpoint}/${id}`, { headers });
      await fetchTransactions();
      return true;
    } catch (err) {
      console.error(
        "Failed to delete transaction",
        err?.response || err.message || err
      );
      throw err;
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const filteredTransactions = useMemo(
    () => filterTransactions(transactions, timeFrame),
    [transactions, timeFrame]
  ); // FIlter with time frame

  const stats = useMemo(() => {
    const now = new Date();
    // Calculate last 30 days transactions
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

     const last30DaysTransactions = transactions.filter((t) => {
    const d = new Date(t.date);
    return d >= thirtyDaysAgo && d <= now;
  });


  // Calculate last 30 days income
    const last30DaysIncome = last30DaysTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);

      // Calculate last 30 days expenses
    const last30DaysExpenses = last30DaysTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);



      // Calculate last 30 days savings
    const last30DaysSavings = last30DaysIncome - last30DaysExpenses;
      // Calculate all time income
    const allTimeIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);

      // all time expenses
    const allTimeExpenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);

      // all time savings
    const allTimeSavings = allTimeIncome - allTimeExpenses;

  // Savings Rate
  const savingsRate =
    last30DaysIncome > 0
      ? Math.round((last30DaysSavings / last30DaysIncome) * 100)
      : 0;



      // last 60 days
   const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(now.getDate() - 60);
  sixtyDaysAgo.setHours(0, 0, 0, 0);

  // Previous 30 Days  Transactions
  
    const previous30DaysTransactions = transactions
    .filter((t) => {
      const date = new Date(t.date);
      return date >= sixtyDaysAgo && date <= thirtyDaysAgo;
    });

    const previous30DaysExpenses = previous30DaysTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const expenseChange =
      previous30DaysExpenses > 0
        ? Math.round(
          ((last30DaysExpenses - previous30DaysExpenses) /
            previous30DaysExpenses) *
          100
        )
        : 0;

    return {
      totalTransactions: transactions.length,
      last30DaysIncome,
      last30DaysExpenses,
      last30DaysSavings: last30DaysIncome - last30DaysExpenses,
      allTimeIncome,
      allTimeExpenses,
      allTimeSavings: allTimeIncome - allTimeExpenses,
      last30DaysCount: last30DaysTransactions.length,
      savingsRate,
      expenseChange,
    };
  }, [transactions]);

  const timeFrameLabel = useMemo(
    () =>
      timeFrame === "daily"
        ? "Today"
        : timeFrame === "weekly"
          ? "This Week"
          : "This Month",
    [timeFrame]
  );

  const outletContext = {
    transactions,
    addTransaction,
    editTransaction,
    deleteTransaction,
    refreshTransactions: fetchTransactions,
    timeFrame,
    setTimeFrame,
    lastUpdated,
  };

  const getSavingsRating = (rate) =>
    rate > 30 ? "Excellent" : rate > 20 ? "Good" : "Needs improvement";

  const topCategories = useMemo(
    () =>
      Object.entries(
        transactions
          .filter((t) => t.type === "expense")
          .reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
            return acc;
          }, {})
      )
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5),
    [transactions]
  );

  const displayedTransactions = showAllTransactions
    ? transactions
    : transactions.slice(0, 4);

  return (
    <div className={styles.layout.root}>
      <Navbar user={user} onLogout={onLogout} />
      <Sidebar
        user={user}
        isCollapsed={sidebarcollapsed}
        setIsCollapsed={setSidebarCollapsed}
      />
      <div className={styles.layout.mainContainer(sidebarcollapsed)}>
        <div className={styles.header.container}>
          <div>
            <h1 className={styles.header.title}>
              Dashboard
            </h1>
            <p className={styles.header.subtitle}>
Welcome to your dashboard! View your account, recent activity, and access key features—all in one place. Use the sidebar to navigate and manage your settings.            </p>
          </div>
        </div>


        {/* Balance Section */}


        <div className={styles.statCards.grid}>
          <div className={styles.statCards.card}>
            <div className={styles.statCards.cardHeader}>
              <div>
                <p className={styles.statCards.cardTitle}>
                  Total Balance
                </p>
                <p className={styles.statCards.cardValue}>
                  ${stats.allTimeSavings.toLocaleString("en-US", {
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div className={styles.statCards.iconContainer("teal")}>
                <DollarSign className={styles.statCards.icon("teal")} />
              </div>
            </div>
            <p className={styles.statCards.cardFooter}>
              <span className="text-teal-600 font-medium">
                +${stats.last30DaysSavings.toLocaleString()}
              </span>  {" "}
              This Month
            </p>
          </div>
          {/*For Income */}
          <div className={styles.statCards.card}>
            <div className={styles.statCards.cardHeader}>
              <div>
                <p className={styles.statCards.cardTitle}>
                  Monthly Income
                </p>
                <p className={styles.statCards.cardValue}>
                  ${stats.last30DaysIncome.toLocaleString("en-US", {
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div className={styles.statCards.iconContainer("green")}>
                <ArrowUp className={styles.statCards.icon("green")} />
              </div>
            </div>
            <p className={styles.statCards.cardFooter}>
              <span className="text-green-600 font-medium">
                +12.5%
              </span>  {" "}
              Last Month
            </p>
          </div>

          {/* Monthly Expense */}
          <div className={styles.statCards.card}>
            <div className={styles.statCards.cardHeader}>
              <div>
                <p className={styles.statCards.cardTitle}>
                  Monthly Expense
                </p>
                <p className={styles.statCards.cardValue}>
                  ${stats.last30DaysExpenses.toLocaleString("en-US", {
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div className={styles.statCards.iconContainer("orange")}>
                <ArrowDown className={styles.statCards.icon("orange")} />
              </div>
            </div>
            <p className={styles.statCards.cardFooter}>
              <span
                className={`${styles.colors.expenseChange(
                  stats.expenseChange,
                )} font-medium`}
              >
                {stats.expenseChange > 0 ? "+" : ""}
                {stats.expenseChange}%
              </span> {" "}
              From Last Month
            </p>
          </div>

          {/* Saving rate */}

          <div className={styles.statCards.card}>
            <div className={styles.statCards.cardHeader}>
              <div>
                <p className={styles.statCards.cardTitle}>
                  Saving Rate
                </p>
                <p className={styles.statCards.cardValue}>
                  {stats.savingsRate}%
                </p>
              </div>
              <div className={styles.statCards.iconContainer("blue")}>
                <PiggyBank className={styles.statCards.icon("blue")} />
              </div>
            </div>
            <p className={styles.statCards.cardFooter}>
              {getSavingsRating(stats.savingsRate)}
            </p>
          </div>
        </div>



        {/* Financial Overview */

        }
        <div className={styles.grid.main}>
          <div className={styles.grid.leftColumn}>
            <div className={styles.cards.base}>
              <div className={styles.cards.header}>
                <h3 className={styles.cards.title}>
                  <TrendingUp className="w-6 h-6 text-teal-500" />
                  Financial Overview
                  <span className="text-sm text-gray-500 font-normal">
                    ({timeFrameLabel})
                  </span>
                </h3>
              </div>
              <Outlet context={outletContext} />
            </div>
          </div>
          {/* Right Side  */}
          <div className={styles.grid.rightColumn}>
            <div className={styles.cards.base}>
              <div className={styles.transactions.cardHeader}>
                <h3 className={styles.transactions.cardTitle}>
                  <Clock className="w-6 h-6 text-purple-500" />
                  Recent Transactions
                </h3>
                <button onClick={fetchTransactions}
                  disabled={loading}
                  className={styles.transactions.refreshButton}
                >
                  <RefreshCcw className={styles.transactions.refreshIcon(loading)} />
                </button>
              </div>
              <div className={styles.transactions.dataStackingInfo}>
                <Info className={styles.transactions.dataStackingIcon} />
                <span>
                  Transactions are stacked by date (newest first)
                </span>
              </div>
              <div className={styles.transactions.listContainer}>
                {displayedTransactions.map((transactions) => {
                  const { id, type, category, description, date, amount } = transactions;
                  return (
                    <div key={id} className={styles.transactions.transactionItem}>
                      <div className="flex items-center gap-1 md:gap-4 lg:gap-3">
                        <div className={`p-2 rounded-lg ${styles.colors.transaction.bg(
                          type
                        )}`}>
                          {CATEGORY_ICONS[category] || (
                            <DollarSign className={styles.transactions.icon} />
                          )}
                        </div>
                        <div className={styles.transactions.details}>
                          <p className={styles.transactions.description}>
                            {description}
                          </p>
                          <p className={styles.transactions.meta}>
                            {new Date(date).toLocaleDateString()}
                            <span className="ml-2 capitalize">
                              {category}
                            </span>
                          </p>
                        </div>
                      </div>

                      <span>
                        {type === "income" ? "+" : "-"} ${Number(amount)}
                      </span>
                    </div>
                  );
                })}
                {
                  transactions.length === 0 ? (
                    <div className={styles.transactions.emptyState}>
                      <div className={styles.transactions.emptyIconContainer}>
                        <Clock className={styles.transactions.emptyIcon} />
                      </div>
                      <p className={styles.transactions.emptyText}>
                        No recent transactions
                      </p>
                    </div>
                  ) : (
                    <div className={styles.transactions.viewAllContainer}>
                      <button onClick={() =>
                        setShowAllTransactions(!showAllTransactions)
                      } className={styles.transactions.viewAllButton}>
                        {showAllTransactions ? (
                          <>
                            <ChevronUp className="w-5 h-5" />
                            Show Less
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-5 h-5" />
                            View All Transactions ({filteredTransactions.length})
                          </>
                        )}
                      </button>

                    </div>
                  )
                }
              </div>
            </div>
            {/*  To spend by category*/}
            <div className={styles.cards.base}>
              <h3 className={styles.categories.title}>
                <PieChart className={styles.categories.titleIcon} />
                Spending by category
              </h3>
              <div className={styles.categories.list}>
                {topCategories.map(([category, amount]) => (
                  <div key={category} className={styles.categories.categoryItem}>
                    <div className="flex items-center gap-3">
                      <div className={styles.categories.categoryIconContainer}>
                        {CATEGORY_ICONS[category] || (
                          <DollarSign className={styles.categories.categoryIcon} />
                        )}
                      </div>
                      <span className={styles.categories.categoryName}>
                        {category}
                      </span>
                    </div>
                    <span className={styles.categories.categoryAmount}>
                      ${amount}
                    </span>
                  </div>
                ))}
              </div>

              <div className={styles.categories.summaryContainer}>
                <div className={styles.categories.summaryGrid}>
                  <div className={styles.categories.summaryIncomeCard}>
                    <p className={styles.categories.summaryTitle}>
                      Total Income
                    </p>
                    <p className={styles.categories.summaryValue}>
                      ${stats.allTimeIncome.toLocaleString()}
                    </p>
                  </div>
                  <div className={styles.categories.summaryExpenseCard}>
                    <p className={styles.categories.summaryTitle}>
                      Total Expenses
                    </p>
                    <p className={styles.categories.summaryValue}>
                      ${stats.allTimeExpenses.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Layout