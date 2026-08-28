import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, TextInput, Modal, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { fetchApi } from '../../../../../lib/api';
import { ArrowLeft, Plus, Receipt, User as UserIcon } from 'lucide-react-native';

export default function TripBudget() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const [trip, setTrip] = useState<any>(null);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [balances, setBalances] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  
  // New Expense state
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [payerId, setPayerId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    try {
      const [tripData, expensesData, balancesData] = await Promise.all([
        fetchApi(`/trips/${id}`),
        fetchApi(`/trips/${id}/expenses`),
        fetchApi(`/trips/${id}/expenses/balances`)
      ]);
      setTrip(tripData);
      setExpenses(expensesData);
      setBalances(balancesData);
    } catch (error) {
      console.error('Failed to load budget data', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) loadData();
  }, [id]);

  const handleAddExpense = async () => {
    if (!title || !amount || !payerId) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const totalAmount = parseFloat(amount);
      const memberCount = trip.members.length;
      const splitAmount = parseFloat((totalAmount / memberCount).toFixed(2));
      
      const splits = trip.members.map((m: any, index: number) => {
        let memberShare = splitAmount;
        if (index === 0) {
          memberShare = splitAmount + (totalAmount - splitAmount * memberCount);
        }
        return {
          userId: m.userId,
          amount: parseFloat(memberShare.toFixed(2))
        };
      });

      await fetchApi(`/trips/${id}/expenses`, {
        method: "POST",
        body: JSON.stringify({
          title,
          amount: totalAmount,
          currency: "USD",
          payerId,
          category: "OTHER",
          splits
        }),
      });
      
      setIsAdding(false);
      setTitle('');
      setAmount('');
      setPayerId('');
      loadData();
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F8FAFC]">
        <ActivityIndicator size="large" color="#0EA5E9" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#F8FAFC]">
      <View className="pt-14 pb-4 px-6 bg-[#0EA5E9] shadow-sm z-10 flex-row items-center justify-between">
        <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2 bg-white/20 rounded-full">
                <ArrowLeft color="white" size={20} />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-white">Budget</Text>
        </View>
        <TouchableOpacity onPress={() => setIsAdding(true)} className="p-2 bg-white/20 rounded-full">
            <Plus color="white" size={20} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
        {balances.length > 0 && (
          <View className="mb-8">
            <Text className="text-xl font-bold text-[#0C4A6E] mb-4">Balances</Text>
            {balances.map(balance => (
              <View key={balance.userId} className="bg-white p-4 rounded-2xl mb-3 shadow-sm border border-[#0EA5E9]/10 flex-row justify-between items-center">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 bg-[#F0F9FF] rounded-full items-center justify-center mr-3">
                    <UserIcon color="#0EA5E9" size={20} />
                  </View>
                  <Text className="font-bold text-[#0C4A6E]">{balance.user.firstName}</Text>
                </View>
                <Text className={`font-bold ${balance.balance > 0 ? 'text-green-600' : balance.balance < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                  ${Math.abs(balance.balance).toFixed(2)} {balance.balance > 0 ? 'owes' : balance.balance < 0 ? 'is owed' : 'settled'}
                </Text>
              </View>
            ))}
          </View>
        )}

        <Text className="text-xl font-bold text-[#0C4A6E] mb-4">Expenses</Text>
        {expenses.length === 0 ? (
          <View className="p-8 bg-white rounded-3xl items-center border border-[#0EA5E9]/10">
            <Receipt color="#0EA5E9" size={48} className="mb-4 opacity-50" />
            <Text className="text-xl font-bold text-[#0C4A6E] mb-2">No expenses yet</Text>
            <Text className="text-[#486581] text-center font-medium">Click the + button to add an expense.</Text>
          </View>
        ) : (
          expenses.map(expense => (
            <View key={expense.id} className="bg-white p-4 rounded-2xl mb-3 shadow-sm border border-[#0EA5E9]/10">
              <View className="flex-row justify-between items-start mb-2">
                <Text className="font-bold text-lg text-[#0C4A6E]">{expense.title}</Text>
                <Text className="font-bold text-lg text-[#0C4A6E]">${expense.amount.toFixed(2)}</Text>
              </View>
              <Text className="text-[#486581]">Paid by {expense.payer?.firstName}</Text>
            </View>
          ))
        )}
      </ScrollView>

      {/* Add Expense Modal */}
      <Modal visible={isAdding} animationType="slide" presentationStyle="pageSheet">
        <View className="flex-1 bg-white pt-6 px-6">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-2xl font-bold text-[#0C4A6E]">Add Expense</Text>
            <TouchableOpacity onPress={() => setIsAdding(false)}>
              <Text className="text-[#0EA5E9] font-bold">Cancel</Text>
            </TouchableOpacity>
          </View>

          <View className="space-y-4">
            <View>
              <Text className="text-[#486581] font-medium mb-2">Title</Text>
              <TextInput
                className="w-full bg-[#F0F9FF] border border-[#0EA5E9]/20 rounded-xl p-4 text-[#0C4A6E] font-medium"
                value={title}
                onChangeText={setTitle}
                placeholder="Dinner at Luigi's"
              />
            </View>
            <View>
              <Text className="text-[#486581] font-medium mb-2">Amount</Text>
              <TextInput
                className="w-full bg-[#F0F9FF] border border-[#0EA5E9]/20 rounded-xl p-4 text-[#0C4A6E] font-medium"
                value={amount}
                onChangeText={setAmount}
                placeholder="0.00"
                keyboardType="decimal-pad"
              />
            </View>

            <View>
              <Text className="text-[#486581] font-medium mb-2">Who paid?</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                {trip?.members.map((m: any) => (
                  <TouchableOpacity
                    key={m.userId}
                    onPress={() => setPayerId(m.userId)}
                    className={`mr-3 p-3 rounded-xl border ${payerId === m.userId ? 'bg-[#0EA5E9] border-[#0EA5E9]' : 'bg-[#F0F9FF] border-[#0EA5E9]/20'}`}
                  >
                    <Text className={payerId === m.userId ? 'text-white font-bold' : 'text-[#0C4A6E]'}>
                      {m.user.firstName}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <TouchableOpacity
              onPress={handleAddExpense}
              disabled={isSubmitting}
              className={`w-full p-4 rounded-xl items-center justify-center mt-4 ${isSubmitting ? 'bg-[#0EA5E9]/50' : 'bg-[#0EA5E9]'}`}
            >
              {isSubmitting ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-lg">Add Expense</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
