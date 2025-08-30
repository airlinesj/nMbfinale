// Loyalty Engine Configuration and Rules Management
class LoyaltyEngine {
    constructor() {
        this.customers = [];
        this.loyaltyRules = [];
        this.redemptionRules = [];
        this.transactions = [];
        this.aiInsights = [];
        this.auditLog = [];
        this.init();
    }

    init() {
        this.loadSampleData();
        this.setupEventListeners();
    }

    loadSampleData() {
        // Sample customers with AI insights
        this.customers = [
            {
                id: 1,
                email: 'john.doe@email.com',
                name: 'John Doe',
                segment: 'high-value',
                points: 1250,
                lastActivity: '2024-01-15',
                churnRisk: 'low',
                accountBalance: 5000,
                transactionCount: 45,
                lastLogin: '2024-01-15',
                location: 'Harare'
            },
            {
                id: 2,
                email: 'jane.smith@email.com',
                name: 'Jane Smith',
                segment: 'regular',
                points: 450,
                lastActivity: '2024-01-10',
                churnRisk: 'medium',
                accountBalance: 2500,
                transactionCount: 23,
                lastLogin: '2024-01-10',
                location: 'Bulawayo'
            },
            {
                id: 3,
                email: 'bob.wilson@email.com',
                name: 'Bob Wilson',
                segment: 'at-risk',
                points: 200,
                lastActivity: '2024-12-01',
                churnRisk: 'high',
                accountBalance: 800,
                transactionCount: 5,
                lastLogin: '2024-12-01',
                location: 'Mutare'
            }
        ];

        // Sample loyalty rules
        this.loyaltyRules = [
            {
                id: 1,
                name: 'Transaction Bonus',
                type: 'transaction',
                conditions: [
                    { field: 'amount', operator: '>', value: 100 }
                ],
                points: 50,
                status: 'active',
                createdAt: '2024-01-01'
            },
            {
                id: 2,
                name: 'Referral Reward',
                type: 'referral',
                conditions: [
                    { field: 'referral_count', operator: '>=', value: 1 }
                ],
                points: 100,
                status: 'active',
                createdAt: '2024-01-01'
            },
            {
                id: 3,
                name: 'Login Bonus',
                type: 'engagement',
                conditions: [
                    { field: 'login_frequency', operator: '>=', value: 7 }
                ],
                points: 10,
                status: 'active',
                createdAt: '2024-01-01'
            }
        ];

        // Sample redemption rules
        this.redemptionRules = [
            {
                id: 1,
                name: '10% Discount',
                type: 'discount',
                points: 500,
                value: 10,
                eligibility: 'Active account for 3+ months',
                status: 'active'
            },
            {
                id: 2,
                name: '$25 Cashback',
                type: 'cashback',
                points: 1000,
                value: 25,
                eligibility: 'Minimum balance $1000',
                status: 'active'
            },
            {
                id: 3,
                name: 'Premium Service',
                type: 'service',
                points: 2000,
                value: 50,
                eligibility: 'High-value customer segment',
                status: 'active'
            }
        ];

        // Sample AI insights
        this.aiInsights = [
            {
                customerId: 3,
                risk: 'high',
                reason: 'No activity for 45 days',
                action: 'Send re-engagement email with bonus',
                confidence: 85,
                predictedChurnDate: '2024-02-15'
            },
            {
                customerId: 2,
                risk: 'medium',
                reason: 'Decreased transaction frequency',
                action: 'Offer personalized rewards',
                confidence: 72,
                predictedChurnDate: '2024-03-01'
            }
        ];
    }

    setupEventListeners() {
        // Setup form submissions and button clicks
        document.addEventListener('DOMContentLoaded', () => {
            this.setupLoyaltyRulesForm();
            this.setupRedemptionRulesForm();
            this.setupPointsAdjustmentForm();
            this.setupCustomerSearch();
        });
    }

    // Loyalty Rules Management
    createLoyaltyRule(ruleData) {
        const newRule = {
            id: this.loyaltyRules.length + 1,
            ...ruleData,
            createdAt: new Date().toISOString().split('T')[0],
            status: 'active'
        };
        this.loyaltyRules.push(newRule);
        this.logActivity('Rule Creation', `Created new loyalty rule: ${ruleData.name}`);
        return newRule;
    }

    updateLoyaltyRule(id, updates) {
        const ruleIndex = this.loyaltyRules.findIndex(rule => rule.id === id);
        if (ruleIndex !== -1) {
            this.loyaltyRules[ruleIndex] = { ...this.loyaltyRules[ruleIndex], ...updates };
            this.logActivity('Rule Update', `Updated loyalty rule: ${this.loyaltyRules[ruleIndex].name}`);
            return this.loyaltyRules[ruleIndex];
        }
        return null;
    }

    deleteLoyaltyRule(id) {
        const ruleIndex = this.loyaltyRules.findIndex(rule => rule.id === id);
        if (ruleIndex !== -1) {
            const deletedRule = this.loyaltyRules.splice(ruleIndex, 1)[0];
            this.logActivity('Rule Deletion', `Deleted loyalty rule: ${deletedRule.name}`);
            return deletedRule;
        }
        return null;
    }

    // Redemption Rules Management
    createRedemptionRule(ruleData) {
        const newRule = {
            id: this.redemptionRules.length + 1,
            ...ruleData,
            createdAt: new Date().toISOString().split('T')[0],
            status: 'active'
        };
        this.redemptionRules.push(newRule);
        this.logActivity('Redemption Rule Creation', `Created new redemption rule: ${ruleData.name}`);
        return newRule;
    }

    // Points Management
    adjustPoints(customerEmail, points, reason, adminEmail) {
        const customer = this.customers.find(c => c.email === customerEmail);
        if (customer) {
            const oldPoints = customer.points;
            customer.points += points;
            this.logActivity('Points Adjustment', 
                `${points > 0 ? 'Added' : 'Deducted'} ${Math.abs(points)} points to ${customerEmail}. Reason: ${reason}`, 
                adminEmail);
            return {
                success: true,
                oldPoints,
                newPoints: customer.points,
                customer
            };
        }
        return { success: false, message: 'Customer not found' };
    }

    // Customer Management
    getCustomerByEmail(email) {
        return this.customers.find(c => c.email === email);
    }

    searchCustomers(query, filters = {}) {
        let results = this.customers.filter(customer => 
            customer.name.toLowerCase().includes(query.toLowerCase()) ||
            customer.email.toLowerCase().includes(query.toLowerCase())
        );

        if (filters.segment) {
            results = results.filter(c => c.segment === filters.segment);
        }
        if (filters.churnRisk) {
            results = results.filter(c => c.churnRisk === filters.churnRisk);
        }
        if (filters.minPoints) {
            results = results.filter(c => c.points >= filters.minPoints);
        }

        return results;
    }

    // AI Insights
    calculateChurnRisk(customer) {
        const daysSinceLastActivity = this.getDaysSinceDate(customer.lastActivity);
        const riskFactors = {
            low: daysSinceLastActivity < 7,
            medium: daysSinceLastActivity >= 7 && daysSinceLastActivity < 30,
            high: daysSinceLastActivity >= 30
        };

        if (riskFactors.high) return 'high';
        if (riskFactors.medium) return 'medium';
        return 'low';
    }

    getChurnPrediction(customerId) {
        return this.aiInsights.find(insight => insight.customerId === customerId);
    }

    getAllChurnPredictions() {
        return this.aiInsights;
    }

    // Redemption Logic
    canRedeem(customerEmail, ruleId) {
        const customer = this.getCustomerByEmail(customerEmail);
        const rule = this.redemptionRules.find(r => r.id === ruleId);
        
        if (!customer || !rule) return false;
        
        return customer.points >= rule.points;
    }

    processRedemption(customerEmail, ruleId) {
        const customer = this.getCustomerByEmail(customerEmail);
        const rule = this.redemptionRules.find(r => r.id === ruleId);
        
        if (!this.canRedeem(customerEmail, ruleId)) {
            return { success: false, message: 'Insufficient points or rule not found' };
        }

        customer.points -= rule.points;
        this.logActivity('Redemption', `Customer ${customerEmail} redeemed ${rule.points} points for ${rule.name}`);
        
        return {
            success: true,
            remainingPoints: customer.points,
            reward: rule
        };
    }

    // Audit Logging
    logActivity(action, details, userEmail = 'system@admin.com') {
        const logEntry = {
            timestamp: new Date().toISOString(),
            user: userEmail,
            action,
            details,
            ipAddress: '127.0.0.1' // In real app, get from request
        };
        this.auditLog.unshift(logEntry);
        
        // Keep only last 1000 entries
        if (this.auditLog.length > 1000) {
            this.auditLog = this.auditLog.slice(0, 1000);
        }
    }

    getAuditLog(limit = 50) {
        return this.auditLog.slice(0, limit);
    }

    // Utility Functions
    getDaysSinceDate(dateString) {
        const date = new Date(dateString);
        const today = new Date();
        const diffTime = Math.abs(today - date);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    // Form Setup Functions
    setupLoyaltyRulesForm() {
        const form = document.getElementById('loyalty-rule-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                const ruleData = {
                    name: formData.get('rule-name'),
                    type: formData.get('rule-type'),
                    conditions: this.parseConditions(formData),
                    points: parseInt(formData.get('points-awarded')),
                    status: formData.get('rule-status')
                };
                this.createLoyaltyRule(ruleData);
                form.reset();
                this.refreshLoyaltyRules();
            });
        }
    }

    setupRedemptionRulesForm() {
        const form = document.getElementById('redemption-rule-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                const ruleData = {
                    name: formData.get('redemption-name'),
                    type: formData.get('reward-type'),
                    points: parseInt(formData.get('points-required')),
                    value: parseFloat(formData.get('reward-value')),
                    eligibility: formData.get('eligibility-criteria')
                };
                this.createRedemptionRule(ruleData);
                form.reset();
                this.refreshRedemptionRules();
            });
        }
    }

    setupPointsAdjustmentForm() {
        const form = document.getElementById('points-adjustment-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                const email = formData.get('customer-email');
                const points = parseInt(formData.get('points-adjustment'));
                const reason = formData.get('adjustment-reason');
                const adminEmail = 'admin@bank.com'; // Get from session
                
                const result = this.adjustPoints(email, points, reason, adminEmail);
                if (result.success) {
                    alert(`Points adjusted successfully. New balance: ${result.newPoints}`);
                    form.reset();
                } else {
                    alert(result.message);
                }
            });
        }
    }

    setupCustomerSearch() {
        const searchBtn = document.querySelector('[onclick="searchCustomers()"]');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                const query = document.getElementById('customer-search').value;
                const segment = document.getElementById('segment-filter').value;
                const activity = document.getElementById('activity-filter').value;
                
                const filters = {};
                if (segment) filters.segment = segment;
                if (activity) filters.activity = activity;
                
                const results = this.searchCustomers(query, filters);
                this.displayCustomerResults(results);
            });
        }
    }

    parseConditions(formData) {
        // Parse conditions from form data
        return [];
    }

    refreshLoyaltyRules() {
        // Refresh the loyalty rules display
        console.log('Refreshing loyalty rules...');
    }

    refreshRedemptionRules() {
        // Refresh the redemption rules display
        console.log('Refreshing redemption rules...');
    }

    displayCustomerResults(customers) {
        const tbody = document.getElementById('customer-list');
        if (tbody) {
            tbody.innerHTML = customers.map(customer => `
                <tr>
                    <td>
                        <div class="customer-info">
                            <div class="customer-name">${customer.name}</div>
                            <div class="customer-email">${customer.email}</div>
                        </div>
                    </td>
                    <td><span class="segment-badge ${customer.segment}">${customer.segment}</span></td>
                    <td>${customer.points}</td>
                    <td><span class="churn-indicator churn-${customer.churnRisk}">${customer.churnRisk}</span></td>
                    <td>${customer.lastActivity}</td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="loyaltyEngine.viewCustomer('${customer.email}')">View</button>
                        <button class="btn btn-sm btn-warning" onclick="loyaltyEngine.adjustPoints('${customer.email}', 0, 'Manual adjustment')">Adjust</button>
                    </td>
                </tr>
            `).join('');
        }
    }

    viewCustomer(email) {
        const customer = this.getCustomerByEmail(email);
        if (customer) {
            alert(`Customer Details:\nName: ${customer.name}\nEmail: ${customer.email}\nPoints: ${customer.points}\nSegment: ${customer.segment}`);
        }
    }
}

// Initialize the loyalty engine
const loyaltyEngine = new LoyaltyEngine();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LoyaltyEngine;
}
