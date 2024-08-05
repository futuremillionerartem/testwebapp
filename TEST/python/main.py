from aiogram import Bot, Dispatcher, executor, types
from aiogram.types.web_app_info import WebAppInfo
import aiogram

bot = Bot('7448436598:AAHzaMrx-DVOiZ4oKIEq31oZ1JrTq5QpdiE')
dp = Dispatcher(bot)

@dp.message_handler(commands=['start'])
async def start(message: types.Message):
    markup = types.InlineKeyboardMarkup(resize_keyboard=True)
    markup.add(types.InlineKeyboardButton('Open', web_app=WebAppInfo(url='https://bstnx.github.io/testwebapp/')))
    await message.answer('Hello', reply_markup=markup)
    
executor.start_polling(dp)