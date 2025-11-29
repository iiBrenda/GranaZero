const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'grana-zero-tech-secret-2024-ai-powered';

// Middleware avançado
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos da pasta raiz
app.use(express.static(__dirname));

// Arquivo de "banco de dados"
const DB_FILE = path.join(__dirname, 'data', 'database.json');

// Inicializar banco de dados com dados mais robustos
function initializeDB() {
    if (!fs.existsSync(path.dirname(DB_FILE))) {
        fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
    }
    
    if (!fs.existsSync(DB_FILE)) {
        const initialData = {
            users: [],
            transactions: [],
            friendRequests: [],
            friendships: [],
            aiInsights: [],
            financialGoals: [],
            categories: [
                { id: 'alimentacao', name: 'Alimentação', type: 'expense', color: '#f59e0b', icon: 'utensils' },
                { id: 'transporte', name: 'Transporte', type: 'expense', color: '#3b82f6', icon: 'car' },
                { id: 'entretenimento', name: 'Entretenimento', type: 'expense', color: '#ec4899', icon: 'film' },
                { id: 'educacao', name: 'Educação', type: 'expense', color: '#10b981', icon: 'graduation-cap' },
                { id: 'saude', name: 'Saúde', type: 'expense', color: '#ef4444', icon: 'heart' },
                { id: 'moradia', name: 'Moradia', type: 'expense', color: '#8b5cf6', icon: 'home' },
                { id: 'salario', name: 'Salário', type: 'income', color: '#10b981', icon: 'money-bill-wave' },
                { id: 'freelance', name: 'Freelance', type: 'income', color: '#6366f1', icon: 'laptop-code' },
                { id: 'investimentos', name: 'Investimentos', type: 'income', color: '#06b6d4', icon: 'chart-line' },
                { id: 'presentes', name: 'Presentes', type: 'income', color: '#d946ef', icon: 'gift' }
            ]
        };
        fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
        console.log('🎯 Banco de dados inicializado com sucesso');
    }
}

// Funções do banco de dados
function readDB() {
    try {
        const data = fs.readFileSync(DB_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('❌ Erro ao ler banco de dados:', error);
        return { users: [], transactions: [], friendRequests: [], friendships: [], aiInsights: [], financialGoals: [], categories: [] };
    }
}

function writeDB(data) {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('❌ Erro ao escrever banco de dados:', error);
        return false;
    }
}

// Middleware de autenticação
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ 
            success: false,
            error: 'Token de acesso necessário',
            code: 'AUTH_REQUIRED'
        });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ 
                success: false,
                error: 'Token inválido ou expirado',
                code: 'INVALID_TOKEN'
            });
        }
        req.user = user;
        next();
    });
}

// 🔐 ROTAS DE AUTENTICAÇÃO AVANÇADAS

// Health Check da API
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: '🚀 API Grana Zero operacional',
        timestamp: new Date().toISOString(),
        version: '2.0.0',
        features: ['AI Insights', 'Dashboard 3D', 'Sistema Social', 'Analytics Preditivo']
    });
});

// Registrar usuário com validações avançadas
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password, confirmPassword, studentInfo } = req.body;

        // Validações avançadas
        if (!name || name.length < 2 || name.length > 30) {
            return res.status(400).json({ 
                success: false,
                error: 'Nome deve ter entre 2 e 30 caracteres',
                code: 'INVALID_NAME'
            });
        }

        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            return res.status(400).json({ 
                success: false,
                error: 'Email deve ser válido',
                code: 'INVALID_EMAIL'
            });
        }

        if (!password || password.length < 8) {
            return res.status(400).json({ 
                success: false,
                error: 'Senha deve ter pelo menos 8 caracteres',
                code: 'WEAK_PASSWORD'
            });
        }

        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
            return res.status(400).json({ 
                success: false,
                error: 'Senha deve conter letras maiúsculas, minúsculas e números',
                code: 'PASSWORD_COMPLEXITY'
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ 
                success: false,
                error: 'As senhas não coincidem',
                code: 'PASSWORD_MISMATCH'
            });
        }

        const db = readDB();
        
        // Verificar se email já existe
        const existingUser = db.users.find(user => user.email === email);
        if (existingUser) {
            return res.status(400).json({ 
                success: false,
                error: 'Email já cadastrado',
                code: 'EMAIL_EXISTS'
            });
        }

        // Hash da senha
        const hashedPassword = await bcrypt.hash(password, 12);

        // Criar usuário com dados expandidos
        const user = {
            id: uuidv4(),
            name,
            email,
            password: hashedPassword,
            studentInfo: studentInfo || {},
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            isVerified: false,
            preferences: {
                currency: 'BRL',
                theme: 'dark',
                notifications: true,
                language: 'pt-BR'
            },
            stats: {
                totalTransactions: 0,
                totalSaved: 0,
                streak: 0
            }
        };

        db.users.push(user);
        writeDB(db);

        // Gerar token
        const token = jwt.sign(
            { 
                userId: user.id, 
                email: user.email,
                name: user.name
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        console.log(`✅ Novo usuário registrado: ${email}`);

        res.status(201).json({
            success: true,
            message: '🎉 Conta criada com sucesso!',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                preferences: user.preferences,
                stats: user.stats
            }
        });

    } catch (error) {
        console.error('❌ Erro no registro:', error);
        res.status(500).json({ 
            success: false,
            error: 'Erro interno do servidor',
            code: 'SERVER_ERROR'
        });
    }
});

// Login com analytics
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ 
                success: false,
                error: 'Email e senha são obrigatórios',
                code: 'MISSING_CREDENTIALS'
            });
        }

        const db = readDB();
        const user = db.users.find(user => user.email === email);

        if (!user) {
            return res.status(400).json({ 
                success: false,
                error: 'Credenciais inválidas',
                code: 'INVALID_CREDENTIALS'
            });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ 
                success: false,
                error: 'Credenciais inválidas',
                code: 'INVALID_CREDENTIALS'
            });
        }

        // Atualizar último login
        user.lastLogin = new Date().toISOString();
        user.stats.streak += 1;
        writeDB(db);

        // Gerar token
        const token = jwt.sign(
            { 
                userId: user.id, 
                email: user.email,
                name: user.name
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        console.log(`🔐 Login realizado: ${email}`);

        res.json({
            success: true,
            message: '👋 Bem-vindo de volta!',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                preferences: user.preferences,
                stats: user.stats
            }
        });

    } catch (error) {
        console.error('❌ Erro no login:', error);
        res.status(500).json({ 
            success: false,
            error: 'Erro interno do servidor',
            code: 'SERVER_ERROR'
        });
    }
});

// 📊 ROTAS DE DASHBOARD E ANALYTICS AVANÇADOS

// Dashboard principal com dados para gráficos 3D
app.get('/api/dashboard/overview', authenticateToken, (req, res) => {
    try {
        const db = readDB();
        const userTransactions = db.transactions.filter(
            transaction => transaction.userId === req.user.userId
        );

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        // Dados do mês atual
        const monthlyTransactions = userTransactions.filter(transaction => {
            const transactionDate = new Date(transaction.date);
            return transactionDate.getMonth() === currentMonth && 
                   transactionDate.getFullYear() === currentYear;
        });

        // Cálculos avançados
        const totalIncome = monthlyTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const totalExpenses = monthlyTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const balance = totalIncome - totalExpenses;

        // Análise por categoria para gráfico 3D
        const categoryAnalysis = db.categories.map(category => {
            const categoryTransactions = monthlyTransactions.filter(
                t => t.category === category.id
            );
            const total = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
            const count = categoryTransactions.length;

            return {
                category: category.name,
                id: category.id,
                type: category.type,
                total,
                count,
                color: category.color,
                icon: category.icon,
                percentage: category.type === 'expense' ? (total / totalExpenses) * 100 : (total / totalIncome) * 100
            };
        });

        // Tendências mensais (últimos 6 meses)
        const monthlyTrends = [];
        for (let i = 5; i >= 0; i--) {
            const date = new Date(currentYear, currentMonth - i, 1);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            
            const monthTransactions = userTransactions.filter(t => {
                const tDate = new Date(t.date);
                return `${tDate.getFullYear()}-${String(tDate.getMonth() + 1).padStart(2, '0')}` === monthKey;
            });

            const monthIncome = monthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
            const monthExpenses = monthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

            monthlyTrends.push({
                period: monthKey,
                income: monthIncome,
                expenses: monthExpenses,
                balance: monthIncome - monthExpenses
            });
        }

        // Insights preditivos
        const averageMonthlyExpense = totalExpenses;
        const predictedNextMonth = averageMonthlyExpense * 1.05; // +5% baseado no histórico

        res.json({
            success: true,
            data: {
                overview: {
                    balance,
                    totalIncome,
                    totalExpenses,
                    transactionsCount: monthlyTransactions.length,
                    financialHealth: balance > totalExpenses * 0.3 ? 'excellent' : balance > 0 ? 'good' : 'warning'
                },
                categoryAnalysis: categoryAnalysis.filter(c => c.total > 0),
                monthlyTrends,
                predictions: {
                    nextMonthExpense: predictedNextMonth,
                    savingsOpportunity: totalExpenses * 0.15, // 15% de economia potencial
                    trend: totalExpenses > monthlyTrends[monthlyTrends.length - 2]?.expenses ? 'up' : 'down'
                }
            }
        });

    } catch (error) {
        console.error('❌ Erro ao obter dashboard:', error);
        res.status(500).json({ 
            success: false,
            error: 'Erro interno do servidor',
            code: 'SERVER_ERROR'
        });
    }
});

// 🤖 ROTAS DE AI INSIGHTS

// Gerar insights inteligentes
app.get('/api/ai/insights', authenticateToken, (req, res) => {
    try {
        const db = readDB();
        const userTransactions = db.transactions.filter(
            transaction => transaction.userId === req.user.userId
        );

        // Análise inteligente de gastos
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        const currentMonthTransactions = userTransactions.filter(t => {
            const tDate = new Date(t.date);
            return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
        });

        const lastMonthTransactions = userTransactions.filter(t => {
            const tDate = new Date(t.date);
            return tDate.getMonth() === currentMonth - 1 && tDate.getFullYear() === currentYear;
        });

        // Calcular insights
        const currentExpenses = currentMonthTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const lastMonthExpenses = lastMonthTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const expenseChange = lastMonthExpenses > 0 ? 
            ((currentExpenses - lastMonthExpenses) / lastMonthExpenses) * 100 : 0;

        // Análise de categorias problemáticas
        const categorySpending = {};
        currentMonthTransactions.forEach(t => {
            if (t.type === 'expense') {
                categorySpending[t.category] = (categorySpending[t.category] || 0) + t.amount;
            }
        });

        const topSpendingCategory = Object.entries(categorySpending)
            .sort(([,a], [,b]) => b - a)[0];

        // Gerar insights
        const insights = [];

        if (expenseChange > 20) {
            insights.push({
                type: 'warning',
                title: 'Atenção aos Gastos',
                message: `Seus gastos aumentaram ${expenseChange.toFixed(1)}% em relação ao mês anterior`,
                suggestion: 'Reveja suas despesas da categoria que mais cresceu',
                icon: 'exclamation-triangle',
                priority: 'high'
            });
        }

        if (topSpendingCategory) {
            const category = db.categories.find(c => c.id === topSpendingCategory[0]);
            insights.push({
                type: 'info',
                title: 'Maior Gasto',
                message: `Sua maior despesa é em ${category?.name || 'categoria desconhecida'}`,
                suggestion: 'Considere otimizar gastos nesta categoria',
                icon: 'chart-pie',
                priority: 'medium'
            });
        }

        // Insight de economia
        const potentialSavings = currentExpenses * 0.15;
        insights.push({
            type: 'success',
            title: 'Oportunidade de Economia',
            message: `Você pode economizar até R$ ${potentialSavings.toFixed(2)} este mês`,
            suggestion: 'Reduza gastos não essenciais em 15%',
            icon: 'piggy-bank',
            priority: 'medium'
        });

        res.json({
            success: true,
            data: {
                insights,
                summary: {
                    currentExpenses,
                    expenseChange,
                    potentialSavings,
                    topCategory: topSpendingCategory ? {
                        name: db.categories.find(c => c.id === topSpendingCategory[0])?.name,
                        amount: topSpendingCategory[1]
                    } : null
                }
            }
        });

    } catch (error) {
        console.error('❌ Erro ao gerar insights:', error);
        res.status(500).json({ 
            success: false,
            error: 'Erro interno do servidor',
            code: 'SERVER_ERROR'
        });
    }
});

// 📈 ROTAS DE TRANSAÇÕES (mantidas do seu código original com pequenas melhorias)

// Obter transações com paginação e filtros
app.get('/api/transactions', authenticateToken, (req, res) => {
    try {
        const { page = 1, limit = 20, type, category, startDate, endDate } = req.query;
        
        const db = readDB();
        let userTransactions = db.transactions.filter(
            transaction => transaction.userId === req.user.userId
        );

        // Aplicar filtros
        if (type) {
            userTransactions = userTransactions.filter(t => t.type === type);
        }
        if (category) {
            userTransactions = userTransactions.filter(t => t.category === category);
        }
        if (startDate) {
            userTransactions = userTransactions.filter(t => new Date(t.date) >= new Date(startDate));
        }
        if (endDate) {
            userTransactions = userTransactions.filter(t => new Date(t.date) <= new Date(endDate));
        }

        // Ordenar por data (mais recente primeiro)
        userTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Paginação
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + parseInt(limit);
        const paginatedTransactions = userTransactions.slice(startIndex, endIndex);

        // Estatísticas
        const stats = {
            total: userTransactions.length,
            totalIncome: userTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
            totalExpenses: userTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
            page: parseInt(page),
            totalPages: Math.ceil(userTransactions.length / limit)
        };

        res.json({
            success: true,
            data: {
                transactions: paginatedTransactions,
                stats
            }
        });

    } catch (error) {
        console.error('❌ Erro ao obter transações:', error);
        res.status(500).json({ 
            success: false,
            error: 'Erro interno do servidor',
            code: 'SERVER_ERROR'
        });
    }
});

// Adicionar transação com validação avançada
app.post('/api/transactions', authenticateToken, (req, res) => {
    try {
        const { description, amount, type, category, date, paymentMethod, tags } = req.body;

        // Validações avançadas
        if (!description || description.length < 2) {
            return res.status(400).json({ 
                success: false,
                error: 'Descrição deve ter pelo menos 2 caracteres',
                code: 'INVALID_DESCRIPTION'
            });
        }

        if (typeof amount !== 'number' || amount <= 0) {
            return res.status(400).json({ 
                success: false,
                error: 'Valor deve ser um número positivo',
                code: 'INVALID_AMOUNT'
            });
        }

        if (!['income', 'expense'].includes(type)) {
            return res.status(400).json({ 
                success: false,
                error: 'Tipo deve ser income ou expense',
                code: 'INVALID_TYPE'
            });
        }

        const db = readDB();
        
        // Verificar se categoria existe
        const categoryExists = db.categories.find(c => c.id === category);
        if (!categoryExists) {
            return res.status(400).json({ 
                success: false,
                error: 'Categoria inválida',
                code: 'INVALID_CATEGORY'
            });
        }

        const transaction = {
            id: uuidv4(),
            userId: req.user.userId,
            description: description.trim(),
            amount: Math.round(amount * 100) / 100, // Garantir 2 casas decimais
            type,
            category,
            date: new Date(date).toISOString(),
            paymentMethod: paymentMethod || 'outros',
            tags: tags || [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        db.transactions.push(transaction);
        
        // Atualizar estatísticas do usuário
        const user = db.users.find(u => u.id === req.user.userId);
        if (user) {
            user.stats.totalTransactions += 1;
            if (type === 'income') {
                user.stats.totalSaved += amount * 0.2; // Assume 20% de economia em receitas
            }
        }

        writeDB(db);

        console.log(`💳 Nova transação: ${description} - R$ ${amount}`);

        res.status(201).json({
            success: true,
            message: '✅ Transação adicionada com sucesso',
            data: { transaction }
        });

    } catch (error) {
        console.error('❌ Erro ao adicionar transação:', error);
        res.status(500).json({ 
            success: false,
            error: 'Erro interno do servidor',
            code: 'SERVER_ERROR'
        });
    }
});

// 📋 ROTAS DE CATEGORIAS

// Obter categorias com estatísticas
app.get('/api/categories', authenticateToken, (req, res) => {
    try {
        const db = readDB();
        const userTransactions = db.transactions.filter(
            transaction => transaction.userId === req.user.userId
        );

        // Adicionar estatísticas de uso para cada categoria
        const categoriesWithStats = db.categories.map(category => {
            const categoryTransactions = userTransactions.filter(t => t.category === category.id);
            const totalAmount = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
            const transactionCount = categoryTransactions.length;

            return {
                ...category,
                stats: {
                    totalAmount,
                    transactionCount,
                    lastUsed: categoryTransactions.length > 0 ? 
                        new Date(Math.max(...categoryTransactions.map(t => new Date(t.date)))) : null
                }
            };
        });

        res.json({
            success: true,
            data: { categories: categoriesWithStats }
        });

    } catch (error) {
        console.error('❌ Erro ao obter categorias:', error);
        res.status(500).json({ 
            success: false,
            error: 'Erro interno do servidor',
            code: 'SERVER_ERROR'
        });
    }
});

// 👥 ROTAS DE SISTEMA SOCIAL (mantidas do seu código com melhorias)

// ... (manter as rotas de amigos do seu código original, mas adicionar melhorias similares)

// Rota para servir o frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Inicializar servidor
initializeDB();

app.listen(PORT, () => {
    console.log('🚀 ' + '='.repeat(50));
    console.log('🤖 GRANA ZERO - SERVIDOR TECNOLÓGICO INICIADO');
    console.log('📊 Porta:', PORT);
    console.log('🌐 Ambiente:', process.env.NODE_ENV || 'development');
    console.log('🕒 Iniciado em:', new Date().toLocaleString('pt-BR'));
    console.log('📈 Endpoints disponíveis:');
    console.log('   🔐 Auth:    /api/auth/*');
    console.log('   📊 Dashboard:/api/dashboard/*');
    console.log('   🤖 AI:      /api/ai/*');
    console.log('   💰 Trans:   /api/transactions/*');
    console.log('   👥 Social:  /api/friends/*');
    console.log('🚀 ' + '='.repeat(50));
    console.log(`📍 Frontend: http://localhost:${PORT}`);
    console.log(`📍 API Base: http://localhost:${PORT}/api`);
    console.log(`📍 Health:   http://localhost:${PORT}/api/health`);
});