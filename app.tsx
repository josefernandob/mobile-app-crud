import React, { useEffect, useState } from 'react';
import { 
    ActivityIndicator, 
    FlatList, 
    SafeAreaView, 
    StyleSheet, 
    Text, 
    TextInput, 
    View, 
    TouchableOpacity,
    Alert
} from 'react-native';

// 🚨 CONFIGURAÇÃO IMPORTANTE:
// Substitua 'SEU_IP_AQUI' pelo IP da sua máquina onde o backend está rodando.
const API_URL = "https://backend-api-crud-coral.vercel.app"; 
// A rota completa para os produtos será construída assim:
const API_ENDPOINT = `${API_URL}/products`;

// 💡 Definição do Tipo (TypeScript)
type Product = { 
    id: number; 
    name: string; 
    price: number; 
};

export default function App() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [inputName, setInputName] = useState('');
    const [inputPrice, setInputPrice] = useState('');
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    // #################################################
    // #           OPERAÇÕES CRUD (FRONTEND)           #
    // #################################################

    // 1. READ (Ler Todos)
    async function fetchProducts() {
        if (!loading) setRefreshing(true);
        try {
            const response = await fetch(API_ENDPOINT);
            const data: Product[] = await response.json();
            setProducts(data);
        } catch (error) {
            console.error("Erro ao carregar produtos:", error);
            Alert.alert("Erro", "Não foi possível conectar ao backend.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }

    // 2. CREATE / UPDATE (Cadastrar / Editar)
    async function handleSubmit() {
        if (!inputName || !inputPrice) {
            Alert.alert("Atenção", "Preencha nome e preço.");
            return;
        }

        const productData = { name: inputName, price: inputPrice };

        try {
            if (editingProduct) {
                // UPDATE (PUT)
                await fetch(`${API_ENDPOINT}/${editingProduct.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(productData),
                });
                Alert.alert("Sucesso", "Produto editado!");
                setEditingProduct(null);
            } else {
                // CREATE (POST)
                await fetch(API_ENDPOINT, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(productData),
                });
                Alert.alert("Sucesso", "Produto cadastrado!");
            }
            // Limpa os campos e recarrega a lista
            setInputName('');
            setInputPrice('');
            fetchProducts(); 
        } catch (error) {
            Alert.alert("Erro", "Falha ao salvar o produto.");
            console.error(error);
        }
    }

    // 3. DELETE (Deletar)
    async function deleteProduct(id: number) {
        Alert.alert(
            "Confirmar Exclusão",
            "Tem certeza que deseja deletar este produto?",
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Deletar", 
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await fetch(`${API_ENDPOINT}/${id}`, {
                                method: 'DELETE',
                            });
                            Alert.alert("Sucesso", "Produto deletado!");
                            fetchProducts();
                        } catch (error) {
                            Alert.alert("Erro", "Falha ao deletar o produto.");
                            console.error(error);
                        }
                    }
                }
            ]
        );
    }
    
    // Inicia o modo de edição, preenchendo os campos com os dados do produto
    const startEdit = (product: Product) => {
        setEditingProduct(product);
        setInputName(product.name);
        setInputPrice(product.price.toString());
    };

    // 🚀 Carrega os produtos ao montar o componente
    useEffect(() => {
        fetchProducts();
    }, []);

    // ⏳ Tela de Carregamento
    if (loading) {
        return (
            <SafeAreaView style={styles.center}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.muted}>Carregando dados da API...</Text>
            </SafeAreaView>
        );
    }
    
    // Componente Card para cada produto na lista
    const renderProduct = ({ item }: { item: Product }) => (
        <View style={styles.card}>
            <View style={styles.infoContainer}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardPrice}>R$ {item.price.toFixed(2).replace('.', ',')}</Text>
            </View>
            <View style={styles.actions}>
                <TouchableOpacity 
                    style={[styles.button, styles.editButton]}
                    onPress={() => startEdit(item)}
                >
                    <Text style={styles.buttonText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.button, styles.deleteButton]}
                    onPress={() => deleteProduct(item.id)}
                >
                    <Text style={styles.buttonText}>X</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    // 🖼️ Estrutura Principal
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.appTitle}>CRUD de Produtos</Text>

            {/* Formulário de Cadastro/Edição */}
            <View style={styles.form}>
                <Text style={styles.formTitle}>
                    {editingProduct ? 'Editar Produto (ID: ' + editingProduct.id + ')' : 'Novo Produto'}
                </Text>
                <TextInput
                    placeholder="Nome do Produto"
                    value={inputName}
                    onChangeText={setInputName}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Preço (Ex: 1500.00)"
                    value={inputPrice}
                    onChangeText={setInputPrice}
                    keyboardType="numeric"
                    style={styles.input}
                />
                <TouchableOpacity 
                    style={styles.submitButton}
                    onPress={handleSubmit}
                >
                    <Text style={styles.submitButtonText}>
                        {editingProduct ? 'Salvar Edição' : 'Cadastrar'}
                    </Text>
                </TouchableOpacity>
                {editingProduct && (
                    <TouchableOpacity 
                        style={styles.cancelButton}
                        onPress={() => {
                            setEditingProduct(null);
                            setInputName('');
                            setInputPrice('');
                        }}
                    >
                        <Text style={styles.cancelButtonText}>Cancelar Edição</Text>
                    </TouchableOpacity>
                )}
            </View>

            <Text style={styles.listTitle}>Lista de Produtos</Text>

            {/* Lista de Produtos */}
            <FlatList
                data={products}
                keyExtractor={(item) => String(item.id)}
                onRefresh={fetchProducts}
                refreshing={refreshing}
                ListEmptyComponent={<Text style={styles.muted}>Nenhum produto cadastrado.</Text>}
                renderItem={renderProduct}
            />
        </SafeAreaView>
    );
}

// 🎨 Estilos
const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: "#F0F4F8" 
    },
    center: { 
        flex: 1, 
        justifyContent: "center", 
        alignItems: "center" 
    },
    muted: { 
        color: "#777", 
        marginTop: 10,
        textAlign: 'center',
    },
    appTitle: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingVertical: 15,
        backgroundColor: '#FFF',
        color: '#2C3E50',
    },
    form: {
        padding: 20,
        backgroundColor: '#EBEFF3',
        marginBottom: 10,
    },
    formTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#34495E',
    },
    input: {
        backgroundColor: "#FFF",
        padding: 12,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#CCC',
        marginBottom: 10,
        fontSize: 16,
    },
    submitButton: {
        backgroundColor: '#2ECC71', // Verde para cadastrar/salvar
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 8,
    },
    submitButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    cancelButton: {
        backgroundColor: '#95A5A6', // Cinza para cancelar
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    listTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 16,
        marginTop: 10,
        marginBottom: 5,
        color: '#34495E',
    },
    card: {
        backgroundColor: "#FFF",
        marginHorizontal: 16,
        marginVertical: 4,
        padding: 15,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderLeftWidth: 5,
        borderLeftColor: '#3498DB', // Azul para destacar
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    infoContainer: {
        flex: 1,
    },
    cardTitle: { 
        fontWeight: "700", 
        fontSize: 18, 
        color: "#2C3E50" 
    },
    cardPrice: { 
        fontSize: 15, 
        color: "#27AE60" // Verde para preço
    },
    actions: {
        flexDirection: 'row',
        marginLeft: 10,
    },
    button: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 5,
        marginLeft: 8,
    },
    editButton: {
        backgroundColor: '#F39C12', // Laranja para editar
    },
    deleteButton: {
        backgroundColor: '#E74C3C', // Vermelho para deletar
    },
    buttonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 14,
    }
});