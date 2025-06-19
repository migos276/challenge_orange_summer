/**
 * Application de gestion d'annuaire employés
 * Avec persistance localStorage et interface responsive
 */
class EmployeeDirectory {
    constructor() {
        this.employees = this.loadEmployees();
        this.currentDeleteId = null;
        this.currentView = 'add'; // 'add' ou 'list'
        this.filteredEmployees = [...this.employees];
        
        this.initializeApp();
    }

    /**
     * Initialisation de l'application
     */
    initializeApp() {
        this.bindEvents();
        this.updateStats();
        this.showAddForm();
        
        // Afficher la liste si des employés existent
        if (this.employees.length > 0) {
            this.showEmployeesList();
        }
    }

    /**
     * Liaison des événements DOM
     */
    bindEvents() {
        // Formulaire
        const form = document.getElementById('employeeForm');
        form.addEventListener('submit', (e) => this.handleFormSubmit(e));

        // Bouton reset
        const resetBtn = document.getElementById('resetBtn');
        resetBtn.addEventListener('click', () => this.resetForm());

        // Navigation
        const addBtn = document.getElementById('addEmployeeBtn');
        const listBtn = document.getElementById('viewEmployeesBtn');
        
        addBtn.addEventListener('click', () => this.showAddForm());
        listBtn.addEventListener('click', () => this.showEmployeesList());

        // Recherche et filtres
        const searchInput = document.getElementById('searchInput');
        const departmentFilter = document.getElementById('departmentFilter');
        
        searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        departmentFilter.addEventListener('change', (e) => this.handleDepartmentFilter(e.target.value));

        // Modal de confirmation
        const confirmBtn = document.getElementById('confirmDelete');
        const cancelBtn = document.getElementById('cancelDelete');
        
        confirmBtn.addEventListener('click', () => this.confirmDelete());
        cancelBtn.addEventListener('click', () => this.closeModal());

        // Fermer le modal en cliquant à l'extérieur
        const modal = document.getElementById('confirmModal');
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });

        // Validation en temps réel
        this.bindValidationEvents();
    }

    /**
     * Liaison des événements de validation
     */
    bindValidationEvents() {
        const fields = ['lastName', 'firstName', 'email', 'position'];
        fields.forEach(field => {
            const input = document.getElementById(field);
            input.addEventListener('blur', () => this.validateField(field));
            input.addEventListener('input', () => this.clearError(field));
        });
    }

    /**
     * Gestion de la soumission du formulaire
     */
    handleFormSubmit(e) {
        e.preventDefault();
        
        if (!this.validateForm()) {
            return;
        }

        const formData = new FormData(e.target);
        const employee = {
            id: Date.now().toString(),
            lastName: formData.get('lastName').trim(),
            firstName: formData.get('firstName').trim(),
            email: formData.get('email').trim().toLowerCase(),
            position: formData.get('position').trim(),
            phone: formData.get('phone').trim(),
            department: formData.get('department'),
            createdAt: new Date().toISOString()
        };

        // Vérifier si l'email existe déjà
        if (this.employees.some(emp => emp.email === employee.email)) {
            this.showError('email', 'Cet email est déjà utilisé');
            return;
        }

        this.addEmployee(employee);
        this.showSuccessMessage();
        this.resetForm();
        
        // Rediriger vers la liste après ajout
        setTimeout(() => {
            this.showEmployeesList();
        }, 1500);
    }

    /**
     * Validation du formulaire
     */
    validateForm() {
        let isValid = true;
        const fields = ['lastName', 'firstName', 'email', 'position'];
        
        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    /**
     * Validation d'un champ spécifique
     */
    validateField(fieldName) {
        const input = document.getElementById(fieldName);
        const value = input.value.trim();
        let isValid = true;
        let errorMessage = '';

        switch (fieldName) {
            case 'lastName':
            case 'firstName':
            case 'position':
                if (!value) {
                    errorMessage = `Le ${fieldName === 'lastName' ? 'nom' : 
                                   fieldName === 'firstName' ? 'prénom' : 'poste'} est requis`;
                    isValid = false;
                } else if (value.length < 2) {
                    errorMessage = 'Minimum 2 caractères requis';
                    isValid = false;
                }
                break;
            case 'email':
                if (!value) {
                    errorMessage = 'L\'email est requis';
                    isValid = false;
                } else if (!this.isValidEmail(value)) {
                    errorMessage = 'Format d\'email invalide';
                    isValid = false;
                }
                break;
        }

        if (!isValid) {
            this.showError(fieldName, errorMessage);
        } else {
            this.clearError(fieldName);
        }

        return isValid;
    }

    /**
     * Validation email
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Afficher une erreur sur un champ
     */
    showError(fieldName, message) {
        const input = document.getElementById(fieldName);
        const errorElement = document.getElementById(fieldName + 'Error');
        
        input.classList.add('error');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    /**
     * Effacer l'erreur d'un champ
     */
    clearError(fieldName) {
        const input = document.getElementById(fieldName);
        const errorElement = document.getElementById(fieldName + 'Error');
        
        input.classList.remove('error');
        errorElement.style.display = 'none';
    }

    /**
     * Ajouter un employé
     */
    addEmployee(employee) {
        this.employees.push(employee);
        this.saveEmployees();
        this.updateStats();
        this.filteredEmployees = [...this.employees];
    }

    /**
     * Supprimer un employé
     */
    deleteEmployee(id) {
        this.employees = this.employees.filter(emp => emp.id !== id);
        this.saveEmployees();
        this.updateStats();
        this.applyCurrentFilters();
        this.renderEmployeesList();
    }

    /**
     * Gestion de la recherche
     */
    handleSearch(searchTerm) {
        this.searchTerm = searchTerm.toLowerCase();
        this.applyCurrentFilters();
        this.renderEmployeesList();
    }

    /**
     * Gestion du filtre par département
     */
    handleDepartmentFilter(department) {
        this.selectedDepartment = department;
        this.applyCurrentFilters();
        this.renderEmployeesList();
    }

    /**
     * Appliquer les filtres actuels
     */
    applyCurrentFilters() {
        this.filteredEmployees = this.employees.filter(employee => {
            const matchesSearch = !this.searchTerm || 
                employee.firstName.toLowerCase().includes(this.searchTerm) ||
                employee.lastName.toLowerCase().includes(this.searchTerm) ||
                employee.email.toLowerCase().includes(this.searchTerm) ||
                employee.position.toLowerCase().includes(this.searchTerm);

            const matchesDepartment = !this.selectedDepartment || 
                employee.department === this.selectedDepartment;

            return matchesSearch && matchesDepartment;
        });
    }

    /**
     * Afficher le formulaire d'ajout
     */
    showAddForm() {
        this.currentView = 'add';
        this.updateNavigation();
        
        document.getElementById('formSection').classList.add('active');
        document.getElementById('employeesSection').classList.remove('active');
    }

    /**
     * Afficher la liste des employés
     */
    showEmployeesList() {
        this.currentView = 'list';
        this.updateNavigation();
        
        document.getElementById('formSection').classList.remove('active');
        document.getElementById('employeesSection').classList.add('active');
        
        this.applyCurrentFilters();
        this.renderEmployeesList();
    }

    /**
     * Mettre à jour la navigation
     */
    updateNavigation() {
        const addBtn = document.getElementById('addEmployeeBtn');
        const listBtn = document.getElementById('viewEmployeesBtn');
        
        addBtn.classList.toggle('active', this.currentView === 'add');
        listBtn.classList.toggle('active', this.currentView === 'list');
    }

    /**
     * Rendu de la liste des employés
     */
    renderEmployeesList() {
        const container = document.getElementById('employeesList');
        
        if (this.filteredEmployees.length === 0) {
            container.innerHTML = this.getEmptyStateHTML();
            return;
        }

        const employeesHTML = this.filteredEmployees.map(employee => 
            this.getEmployeeCardHTML(employee)
        ).join('');
        
        container.innerHTML = employeesHTML;
        
        // Animer l'apparition des cartes
        setTimeout(() => {
            container.querySelectorAll('.employee-card').forEach((card, index) => {
                card.style.animationDelay = `${index * 0.1}s`;
            });
        }, 50);
    }

    /**
     * HTML pour une carte employé
     */
    getEmployeeCardHTML(employee) {
        const departmentName = this.getDepartmentName(employee.department);
        const formattedDate = new Date(employee.createdAt).toLocaleDateString('fr-FR');
        
        return `
            <div class="employee-card" data-id="${employee.id}">
                <div class="employee-info">
                    <div class="employee-details">
                        <h3>${employee.firstName} ${employee.lastName}</h3>
                        <p><i class="fas fa-briefcase"></i> ${employee.position}</p>
                        <p><i class="fas fa-envelope"></i> ${employee.email}</p>
                        ${employee.phone ? `<p><i class="fas fa-phone"></i> ${employee.phone}</p>` : ''}
                        ${employee.department ? `<p><i class="fas fa-building"></i> ${departmentName}</p>` : ''}
                        <p><i class="fas fa-calendar"></i> Ajouté le ${formattedDate}</p>
                    </div>
                    <div class="employee-actions">
                        <button class="btn btn-danger btn-small" onclick="app.showDeleteConfirmation('${employee.id}')">
                            <i class="fas fa-trash"></i>
                            Supprimer
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * HTML pour l'état vide
     */
    getEmptyStateHTML() {
        const message = this.employees.length === 0 ? 
            'Aucun employé enregistré' : 
            'Aucun employé ne correspond à vos critères';
        
        const description = this.employees.length === 0 ? 
            'Commencez par ajouter votre premier employé' :
            'Essayez de modifier vos filtres de recherche';
            
        return `
            <div class="empty-state">
                <div class="empty-state-icon">
                    <i class="fas fa-users"></i>
                </div>
                <h3>${message}</h3>
                <p>${description}</p>
                ${this.employees.length === 0 ? `
                    <button class="btn btn-primary" onclick="app.showAddForm()">
                        <i class="fas fa-plus"></i>
                        Ajouter un employé
                    </button>
                ` : ''}
            </div>
        `;
    }

    /**
     * Obtenir le nom du département
     */
    getDepartmentName(department) {
        const departments = {
            'IT': 'Informatique',
            'RH': 'Ressources Humaines',
            'Commercial': 'Commercial',
            'Marketing': 'Marketing',
            'Finance': 'Finance',
            'Operations': 'Opérations'
        };
        return departments[department] || department;
    }

    /**
     * Afficher la confirmation de suppression
     */
    showDeleteConfirmation(id) {
        this.currentDeleteId = id;
        document.getElementById('confirmModal').classList.add('show');
    }

    /**
     * Confirmer la suppression
     */
    confirmDelete() {
        if (this.currentDeleteId) {
            this.deleteEmployee(this.currentDeleteId);
            this.closeModal();
        }
    }

    /**
     * Fermer le modal
     */
    closeModal() {
        document.getElementById('confirmModal').classList.remove('show');
        this.currentDeleteId = null;
    }

    /**
     * Réinitialiser le formulaire
     */
    resetForm() {
        document.getElementById('employeeForm').reset();
        this.clearAllErrors();
        this.hideSuccessMessage();
    }

    /**
     * Effacer toutes les erreurs
     */
    clearAllErrors() {
        const fields = ['lastName', 'firstName', 'email', 'position'];
        fields.forEach(field => this.clearError(field));
    }

    /**
     * Afficher le message de succès
     */
    showSuccessMessage() {
        const message = document.getElementById('successMessage');
        message.classList.add('show');
        
        setTimeout(() => {
            this.hideSuccessMessage();
        }, 3000);
    }

    /**
     * Masquer le message de succès
     */
    hideSuccessMessage() {
        document.getElementById('successMessage').classList.remove('show');
    }

    /**
     * Mettre à jour les statistiques
     */
    updateStats() {
        document.getElementById('totalEmployees').textContent = this.employees.length;
    }

    /**
     * Charger les employés depuis localStorage
     */
    loadEmployees() {
        try {
            const stored = localStorage.getItem('employees');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Erreur lors du chargement des employés:', error);
            return [];
        }
    }

    /**
     * Sauvegarder les employés dans localStorage
     */
    saveEmployees() {
        try {
            localStorage.setItem('employees', JSON.stringify(this.employees));
        } catch (error) {
            console.error('Erreur lors de la sauvegarde des employés:', error);
        }
    }

    /**
     * Exporter les données (optionnel)
     */
    exportData() {
        const data = JSON.stringify(this.employees, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `employes_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Variables globales
let app;

/**
 * Initialisation de l'application une fois le DOM chargé
 */
function initializeApp() {
    // Vérifier si tous les éléments DOM sont présents
    const requiredElements = [
        'employeeForm', 'resetBtn', 'addEmployeeBtn', 'viewEmployeesBtn',
        'searchInput', 'departmentFilter', 'confirmDelete', 'cancelDelete',
        'confirmModal', 'totalEmployees'
    ];
    
    const missingElements = requiredElements.filter(id => !document.getElementById(id));
    
    if (missingElements.length > 0) {
        console.warn('Éléments DOM manquants:', missingElements);
        // Réessayer dans 100ms
        setTimeout(initializeApp, 100);
        return;
    }
    
    // Initialiser l'application
    app = new EmployeeDirectory();
    
    // Gestion des touches du clavier
    document.addEventListener('keydown', (e) => {
        // Fermer le modal avec Escape
        if (e.key === 'Escape') {
            app.closeModal();
        }
        
        // Raccourcis clavier
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 'n':
                    e.preventDefault();
                    app.showAddForm();
                    break;
                case 'l':
                    e.preventDefault();
                    app.showEmployeesList();
                    break;
            }
        }
    });
    
    console.log('Application Annuaire Employés initialisée avec succès!');
}

// Fonctions globales pour l'accès depuis le HTML
function showAddForm() {
    if (app) app.showAddForm();
}

// Initialisation selon l'état du DOM
if (document.readyState === 'loading') {
    // DOM encore en cours de chargement
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    // DOM déjà chargé
    initializeApp();
}