  // Banking Loyalty Platform - Main Application
class BankingLoyaltyApp {
    constructor() {
        this.customers = [];
        this.transactions = [];
        this.loyaltyPrograms = [];
        this.realTimeUpdates = [];
        this.charts = {};
        this.loyaltyEngine = new LoyaltyEngine();
        this.currentUser = null;
        this.userBalances = {};
        this.interestRates = {};
        this.locationAPI = new ZimbabweLocationAPI();
        
        // Check authentication before initializing
        if (!this.checkAuthentication()) {
            return;
        }
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.generateMockData();
        this.startRealTimeUpdates();
        this.renderDashboard();
        this.setupCharts();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Modal controls
        document.querySelector('.close').addEventListener('click', () => this.closeProgramModal());
        document.getElementById('programForm').addEventListener('submit', (e) => this.handleProgramSubmit(e));

        // Search and filters
        document.getElementById('customerSearch').addEventListener('input', (e) => this.filterCustomers(e.target.value));
        document.getElementById('segmentFilter').addEventListener('change', (e) => this.filterBySegment(e.target.value));
        document.getElementById('dateRange').addEventListener('change', (e) => this.updateAnalytics(e.target.value));

        // Transaction history filters
        document.getElementById('transactionSearch').addEventListener('input', (e) => this.filterTransactions(e.target.value));
        document.getElementById('transactionTypeFilter').addEventListener('change', (e) => this.filterTransactionsByType(e.target.value));
        document.getElementById('transactionDateFilter').addEventListener('change', (e) => this.filterTransactionsByDate(e.target.value));
    }

    switchTab(tabName) {
        // Update nav tabs
        document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update content
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        document.getElementById(tabName).classList.add('active');

        // Refresh charts when switching to analytics
        if (tabName === 'analytics') {
            setTimeout(() => this.refreshCharts(), 100);
        }
    }

    generateMockData() {
        // Generate mock customers
        this.customers = Array.from({ length: 50 }, (_, i) => {
            const location = this.locationAPI.getRandomZimbabweLocation().city;
            return {
                id: `CUST${String(i + 1).padStart(4, '0')}`,
                name: `Customer ${i + 1}`,
                email: `customer${i + 1}@email.com`,
                segment: ['high-value', 'regular', 'at-risk'][Math.floor(Math.random() * 3)],
                loyaltyPoints: Math.floor(Math.random() * 10000),
                lastActivity: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
                location: location,
                totalSpent: Math.floor(Math.random() * 50000),
                transactions: Math.floor(Math.random() * 100)
            };
        });

        // Generate mock transactions
        this.transactions = Array.from({ length: 100 }, (_, i) => ({
            id: `TXN${String(i + 1).padStart(6, '0')}`,
            customerId: this.customers[Math.floor(Math.random() * this.customers.length)].id,
            type: ['purchase', 'reward', 'referral', 'bonus'][Math.floor(Math.random() * 4)],
            amount: Math.floor(Math.random() * 1000),
            timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
            location: ['Store A', 'Store B', 'Online', 'Mobile App'][Math.floor(Math.random() * 4)]
        }));

        // Generate user balances
        this.customers.forEach(customer => {
            this.userBalances[customer.id] = {
                accountBalance: Math.floor(Math.random() * 100000) + 5000,
                availableBalance: Math.floor(Math.random() * 90000) + 1000,
                interestRate: (Math.random() * 5 + 2).toFixed(2)
            };
        });

        // Generate interest rate history
        this.interestRates = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            data: Array.from({ length: 12 }, () => (Math.random() * 3 + 2).toFixed(2))
        };

        // Generate loyalty programs
        this.loyaltyPrograms = [
            {
                id: 1,
                name: 'Behavior-Based Rewards',
                type: 'behavior',
                rules: {
                    purchaseMultiplier: 2,
                    referralBonus: 500,
                    milestoneRewards: true
                },
                participants: 1234,
                active: true
            },
            {
                id: 2,
                name: 'Location-Based Offers',
                type: 'location',
                rules: {
                    proximityBonus: 100,
                    storeVisitReward: 50,
                    geoFencing: true
                },
                participants: 892,
                active: true
            },
            {
                id: 3,
                name: 'Long-term Engagement',
                type: 'engagement',
                rules: {
                    anniversaryBonus: 1000,
                    tierUpgrades: true,
                    retentionRewards: true
                },
                participants: 2156,
                active: true
            }
        ];
    }

    startRealTimeUpdates() {
        setInterval(() => {
            this.generateRealTimeActivity();
            this.updateMetrics();
        }, 5000);
    }

    generateRealTimeActivity() {
        const activities = [
            { type: 'transaction', icon: 'fas fa-credit-card', title: 'New transaction', description: 'Customer CUST0012 spent $245.67' },
            { type: 'reward', icon: 'fas fa-gift', title: 'Reward redeemed', description: 'Customer CUST0089 redeemed 500 points' },
            { type: 'referral', icon: 'fas fa-user-plus', title: 'Referral bonus', description: 'Customer CUST0034 earned 250 points' },
            { type: 'location', icon: 'fas fa-map-marker-alt', title: 'Location check-in', description: 'Customer CUST0076 visited Store A' }
        ];

        const randomActivity = activities[Math.floor(Math.random() * activities.length)];
        this.realTimeUpdates.unshift({
            ...randomActivity,
            timestamp: new Date()
        });

        // Keep only last 10 activities
        this.realTimeUpdates = this.realTimeUpdates.slice(0, 10);
        this.renderActivityFeed();
    }

    renderActivityFeed() {
        const feed = document.getElementById('activityFeed');
        feed.innerHTML = this.realTimeUpdates.map(activity => `
            <div class="activity-item">
                <div class="activity-icon ${activity.type}">
                    <i class="${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-title">${activity.title}</div>
                    <div class="activity-description">${activity.description}</div>
                    <div class="activity-time">${this.formatTime(activity.timestamp)}</div>
                </div>
            </div>
        `).join('');
    }

    updateMetrics() {
        // Simulate real-time metric updates
        const metrics = {
            activeCustomers: 2847 + Math.floor(Math.random() * 50),
            pointsRedeemed: 45230 + Math.floor(Math.random() * 1000),
            engagementRate: 78.5 + (Math.random() - 0.5) * 2,
            revenueImpact: 127000 + Math.floor(Math.random() * 5000)
        };

        Object.entries(metrics).forEach(([key, value]) => {
            const element = document.getElementById(key);
            if (element) {
                if (typeof value === 'number' && key === 'engagementRate') {
                    element.textContent = `${value.toFixed(1)}%`;
                } else if (key === 'revenueImpact') {
                    element.textContent = `$${(value / 1000).toFixed(0)}K`;
                } else {
                    element.textContent = value.toLocaleString();
                }
            }
        });
    }

    renderDashboard() {
        this.renderUserDashboard();
        this.renderCustomersTable();
    }

    renderUserDashboard() {
        // Get current user (for demo, use first customer)
        const currentUser = this.customers[0];
        if (!currentUser) return;

        const userBalance = this.userBalances[currentUser.id];
        if (!userBalance) return;

        // Update balance metrics
        document.getElementById('userBalance').textContent = `$${userBalance.accountBalance.toLocaleString()}`;
        document.getElementById('availableBalance').textContent = `$${userBalance.availableBalance.toLocaleString()}`;
        document.getElementById('loyaltyPoints').textContent = currentUser.loyaltyPoints.toLocaleString();
        document.getElementById('interestRate').textContent = `${userBalance.interestRate}%`;

        // Render account overview
        this.renderAccountOverview(currentUser, userBalance);
        
        // Render recent transactions
        this.renderRecentTransactions(currentUser.id);
        
        // Setup user-specific charts
        this.setupUserCharts(currentUser.id);
    }

    renderAccountOverview(customer, balance) {
        const overviewElement = document.getElementById('accountOverview');
        overviewElement.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div>
                    <strong>Account Number:</strong><br>
                    <span style="color: var(--text-secondary);">${customer.id}</span>
                </div>
                <div>
                    <strong>Account Type:</strong><br>
                    <span style="color: var(--text-secondary);">Premium Savings</span>
                </div>
                <div>
                    <strong>Last Activity:</strong><br>
                    <span style="color: var(--text-secondary);">${this.formatDate(customer.lastActivity)}</span>
                </div>
                <div>
                    <strong>Customer Segment:</strong><br>
                    <span class="segment-badge ${customer.segment}">${customer.segment}</span>
                </div>
            </div>
            <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border);">
                <strong>Total Transactions:</strong> ${customer.transactions}<br>
                <strong>Total Spent:</strong> $${customer.totalSpent.toLocaleString()}
            </div>
        `;
    }

    renderRecentTransactions(customerId) {
        const userTransactions = this.transactions
            .filter(tx => tx.customerId === customerId)
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 5);

        const tbody = document.getElementById('recentTransactions');
        tbody.innerHTML = userTransactions.map(tx => `
            <tr>
                <td>${this.formatDate(tx.timestamp)}</td>
                <td>${tx.type.charAt(0).toUpperCase() + tx.type.slice(1)} at ${tx.location}</td>
                <td>$${tx.amount.toLocaleString()}</td>
                <td>
                    <span class="segment-badge ${tx.type}">${tx.type}</span>
                </td>
            </tr>
        `).join('');
    }

    setupUserCharts(customerId) {
        // Interest Rate Chart
        const interestRateCtx = document.getElementById('interestRateChart').getContext('2d');
        this.charts.interestRate = new Chart(interestRateCtx, {
            type: 'line',
            data: {
                labels: this.interestRates.labels,
                datasets: [{
                    label: 'Interest Rate (%)',
                    data: this.interestRates.data,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Monthly Interest Rate Trends'
                    }
                }
            }
        });

        // Transaction Analytics Chart
        const userTransactions = this.transactions.filter(tx => tx.customerId === customerId);
        const transactionTypes = {};
        userTransactions.forEach(tx => {
            transactionTypes[tx.type] = (transactionTypes[tx.type] || 0) + 1;
        });

        const analyticsCtx = document.getElementById('transactionAnalyticsChart').getContext('2d');
        this.charts.transactionAnalytics = new Chart(analyticsCtx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(transactionTypes).map(type => type.charAt(0).toUpperCase() + type.slice(1)),
                datasets: [{
                    data: Object.values(transactionTypes),
                    backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Transaction Type Distribution'
                    }
                }
            }
        });
    }

    renderCustomersTable() {
        const tbody = document.getElementById('customersTableBody');
        tbody.innerHTML = this.customers.map(customer => `
            <tr>
                <td>
                    <div class="customer-info">
                        <div class="customer-name">${customer.name}</div>
                        <div class="customer-email">${customer.email}</div>
                    </div>
                </td>
                <td>
                    <span class="segment-badge ${customer.segment}">${customer.segment}</span>
                </td>
                <td>${customer.loyaltyPoints.toLocaleString()}</td>
                <td>${this.formatDate(customer.lastActivity)}</td>
                <td>
                    <button class="btn-secondary" onclick="viewCustomer('${customer.id}')">View</button>
                </td>
            </tr>
        `).join('');
    }

    setupCharts() {
        // Customer Segmentation Chart
        const segmentationCtx = document.getElementById('segmentationChart').getContext('2d');
        this.charts.segmentation = new Chart(segmentationCtx, {
            type: 'doughnut',
            data: {
                labels: ['High Value', 'Regular', 'At Risk'],
                datasets: [{
                    data: [
                        this.customers.filter(c => c.segment === 'high-value').length,
                        this.customers.filter(c => c.segment === 'regular').length,
                        this.customers.filter(c => c.segment === 'at-risk').length
                    ],
                    backgroundColor: ['#10b981', '#3b82f6', '#ef4444']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });

        // Engagement Trends Chart
        const engagementCtx = document.getElementById('engagementChart').getContext('2d');
        this.charts.engagement = new Chart(engagementCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Engagement Rate',
                    data: [65, 70, 75, 78, 82, 85],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });

        // Revenue Impact Chart
        const revenueCtx = document.getElementById('revenueChart').getContext('2d');
        this.charts.revenue = new Chart(revenueCtx, {
            type: 'bar',
            data: {
                labels: ['Q1', 'Q2', 'Q3', 'Q4'],
                datasets: [{
                    label: 'Revenue Impact',
                    data: [85, 120, 155, 190],
                    backgroundColor: '#10b981'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });

        // Geographic Distribution Chart - Zimbabwe Cities
        const geoCtx = document.getElementById('geoChart').getContext('2d');
        
        // Get location distribution for Zimbabwe cities
        const locationCounts = {};
        this.customers.forEach(customer => {
            locationCounts[customer.location] = (locationCounts[customer.location] || 0) + 1;
        });
        
        // Get top 5 Zimbabwe cities by customer count
        const topCities = Object.entries(locationCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(entry => ({ city: entry[0], count: entry[1] }));
        
        this.charts.geo = new Chart(geoCtx, {
            type: 'pie',
            data: {
                labels: topCities.map(city => city.city),
                datasets: [{
                    data: topCities.map(city => city.count),
                    backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Customer Distribution by Zimbabwe City'
                    }
                }
            }
        });
    }

    refreshCharts() {
        Object.values(this.charts).forEach(chart => chart.update());
    }

    filterCustomers(searchTerm) {
        const filtered = this.customers.filter(customer => 
            customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        this.renderFilteredCustomers(filtered);
    }

    filterBySegment(segment) {
        const filtered = segment ? this.customers.filter(c => c.segment === segment) : this.customers;
        this.renderFilteredCustomers(filtered);
    }

    renderFilteredCustomers(customers) {
        const tbody = document.getElementById('customersTableBody');
        tbody.innerHTML = customers.map(customer => `
            <tr>
                <td>
                    <div class="customer-info">
                        <div class="customer-name">${customer.name}</div>
                        <div class="customer-email">${customer.email}</div>
                    </div>
                </td>
                <td>
                    <span class="segment-badge ${customer.segment}">${customer.segment}</span>
                </td>
                <td>${customer.loyaltyPoints.toLocaleString()}</td>
                <td>${this.formatDate(customer.lastActivity)}</td>
                <td>
                    <button class="btn-secondary" onclick="viewCustomer('${customer.id}')">View</button>
                </td>
            </tr>
        `).join('');
    }

    openProgramModal() {
        document.getElementById('programModal').style.display = 'block';
    }

    closeProgramModal() {
        document.getElementById('programModal').style.display = 'none';
    }

    handleProgramSubmit(e) {
        e.preventDefault();
        
        const program = {
            id: this.loyaltyPrograms.length + 1,
            name: document.getElementById('programName').value,
            type: document.getElementById('programType').value,
            rules: document.getElementById('programRules').value,
            participants: 0,
            active: true
        };

        this.loyaltyPrograms.push(program);
        this.closeProgramModal();
        
        // Show success message
        alert('Loyalty program created successfully!');
    }

    updateAnalytics(dateRange) {
        // Simulate data updates based on date range
        console.log(`Updating analytics for ${dateRange}`);
    }

    // Transaction History Methods
    filterTransactions(searchTerm) {
        const filtered = this.transactions.filter(tx => 
            tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tx.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tx.type.toLowerCase().includes(searchTerm.toLowerCase())
        );
        this.renderTransactionsTable(filtered);
    }

    filterTransactionsByType(type) {
        const filtered = type ? this.transactions.filter(tx => tx.type === type) : this.transactions;
        this.renderTransactionsTable(filtered);
    }

    filterTransactionsByDate(dateRange) {
        const now = new Date();
        let filtered = this.transactions;
        
        switch(dateRange) {
            case '7d':
                filtered = this.transactions.filter(tx => 
                    (now - new Date(tx.timestamp)) <= 7 * 24 * 60 * 60 * 1000
                );
                break;
            case '30d':
                filtered = this.transactions.filter(tx => 
                    (now - new Date(tx.timestamp)) <= 30 * 24 * 60 * 60 * 1000
                );
                break;
            case '90d':
                filtered = this.transactions.filter(tx => 
                    (now - new Date(tx.timestamp)) <= 90 * 24 * 60 * 60 * 1000
                );
                break;
            // 'all' or default shows all transactions
        }
        
        this.renderTransactionsTable(filtered);
    }

    renderTransactionsTable(transactions = this.transactions) {
        const tbody = document.getElementById('transactionsTableBody');
        const countElement = document.getElementById('transactionCount');
        
        // Sort by timestamp (newest first)
        const sortedTransactions = [...transactions].sort((a, b) => 
            new Date(b.timestamp) - new Date(a.timestamp)
        );

        tbody.innerHTML = sortedTransactions.map(tx => {
            const customer = this.customers.find(c => c.id === tx.customerId);
            const customerName = customer ? customer.name : 'Unknown Customer';
            
            return `
                <tr>
                    <td>${tx.id}</td>
                    <td>${this.formatDate(tx.timestamp)}</td>
                    <td>${tx.type.charAt(0).toUpperCase() + tx.type.slice(1)} - ${customerName}</td>
                    <td>${tx.location}</td>
                    <td>$${tx.amount.toLocaleString()}</td>
                    <td>
                        <span class="segment-badge ${tx.type}">${tx.type}</span>
                    </td>
                    <td>
                        <span class="segment-badge ${Math.random() > 0.2 ? 'high-value' : 'at-risk'}">
                            ${Math.random() > 0.2 ? 'Completed' : 'Pending'}
                        </span>
                    </td>
                </tr>
            `;
        }).join('');

        countElement.textContent = `Showing ${sortedTransactions.length} transactions`;
    }

    formatDate(date) {
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        }).format(date);
    }

    formatTime(date) {
        return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
            Math.ceil((date - new Date()) / (1000 * 60)),
            'minute'
        );
    }

    async checkAuthentication() {
        const token = localStorage.getItem('authToken');
        if (!token) {
            window.location.href = 'login.html';
            return false;
        }

        try {
            // Verify session with backend
            const response = await fetch('http://localhost:3000/api/verify-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token })
            });

            if (!response.ok) {
                // Session is invalid, redirect to login
                localStorage.removeItem('authToken');
                window.location.href = 'login.html';
                return false;
            }

            // Session is valid
            return true;
        } catch (error) {
            console.error('Session verification error:', error);
            localStorage.removeItem('authToken');
            window.location.href = 'login.html';
            return false;
        }
    }
}

// Global functions for button clicks
function createCampaign() {
    alert('Campaign creation feature coming soon!');
}

function sendRewards() {
    alert('Reward distribution feature coming soon!');
}

function analyzeSegment() {
    alert('Segment analysis feature coming soon!');
}

function openProgramModal() {
    app.openProgramModal();
}

function closeProgramModal() {
    app.closeProgramModal();
}

function viewCustomer(customerId) {
    const customer = app.customers.find(c => c.id === customerId);
    if (customer) {
        alert(`Customer Details:\nName: ${customer.name}\nSegment: ${customer.segment}\nPoints: ${customer.loyaltyPoints}\nLocation: ${customer.location}`);
    }
}

function logout() {
    const token = localStorage.getItem('authToken');
    if (token) {
        // Notify backend about logout
        fetch('http://localhost:3000/api/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token })
        }).catch(error => {
            console.error('Logout notification error:', error);
        });
    }
    
    localStorage.removeItem('authToken');
    window.location.href = 'login.html';
}

// New quick action functions
function transferFunds() {
    const amount = prompt('Enter amount to transfer:');
    if (amount && !isNaN(amount) && amount > 0) {
        alert(`Transferring $${amount}...\nTransaction initiated successfully!`);
    } else {
        alert('Please enter a valid amount.');
    }
}

function payBill() {
    const billType = prompt('Enter bill type (e.g., Electricity, Water, Internet):');
    const amount = prompt('Enter bill amount:');
    if (billType && amount && !isNaN(amount) && amount > 0) {
        alert(`Paying ${billType} bill: $${amount}\nPayment processed successfully!`);
    } else {
        alert('Please enter valid bill details.');
    }
}

function viewStatement() {
    const month = prompt('Enter month (e.g., January, February):');
    if (month) {
        alert(`Generating statement for ${month}...\nStatement will be available for download shortly.`);
    } else {
        alert('Please enter a valid month.');
    }
}

function applyForLoan() {
    const loanType = prompt('Enter loan type (e.g., Personal, Business, Education):');
    const amount = prompt('Enter loan amount:');
    if (loanType && amount && !isNaN(amount) && amount > 0) {
        alert(`Loan application submitted for ${loanType} loan: $${amount}\nWe will contact you shortly.`);
    } else {
        alert('Please enter valid loan details.');
    }
}

function contactSupport() {
    alert('Contacting customer support...\nOur support team will reach out to you shortly.\nSupport Hotline: +263 123 456 789');
}

function redeemPoints() {
    const customer = app.customers[0]; // Demo customer
    if (customer && customer.loyaltyPoints > 0) {
        const points = prompt(`You have ${customer.loyaltyPoints} points available.\nEnter points to redeem:`);
        if (points && !isNaN(points) && points > 0 && points <= customer.loyaltyPoints) {
            alert(`Redeeming ${points} loyalty points...\nPoints redeemed successfully!`);
        } else {
            alert('Please enter a valid number of points.');
        }
    } else {
        alert('No loyalty points available for redemption.');
    }
}

// Transaction History Export and Print Functions
function exportTransactions() {
    const table = document.getElementById('transactionsTable');
    const rows = Array.from(table.querySelectorAll('tr'));
    
    // Create CSV content
    let csvContent = "Transaction ID,Date,Description,Location,Amount,Type,Status\n";
    
    rows.slice(1).forEach(row => { // Skip header row
        const cells = Array.from(row.querySelectorAll('td'));
        const rowData = cells.map(cell => {
            // Handle span elements with badges
            const span = cell.querySelector('span');
            if (span) {
                return `"${span.textContent}"`;
            }
            return `"${cell.textContent}"`;
        });
        csvContent += rowData.join(',') + '\n';
    });
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'transaction_history.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    alert('Transaction history exported successfully as CSV!');
}

function printTransactions() {
    const printContent = document.getElementById('transactionsTable').outerHTML;
    const originalContent = document.body.innerHTML;
    
    document.body.innerHTML = `
        <div style="padding: 20px;">
            <h2 style="text-align: center; margin-bottom: 20px;">Transaction History Report</h2>
            ${printContent}
            <div style="margin-top: 20px; text-align: center; font-size: 12px; color: #666;">
                Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
            </div>
        </div>
    `;
    
    window.print();
    document.body.innerHTML = originalContent;
    
    // Re-initialize event listeners after printing
    app.setupEventListeners();
}

// Initialize the application
const app = new BankingLoyaltyApp();

// Add additional CSS for segment badges and customer info
const additionalStyles = `
<style>
.segment-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
}

.segment-badge.high-value {
    background: #d1fae5;
    color: #065f46;
}

.segment-badge.regular {
    background: #dbeafe;
    color: #1e40af;
}

.segment-badge.at-risk {
    background: #fee2e2;
    color: #991b1b;
}

.customer-info {
    display: flex;
    flex-direction: column;
}

.customer-name {
    font-weight: 600;
}

.customer-email {
    font-size: 0.875rem;
    color: var(--text-secondary);
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', additionalStyles);
