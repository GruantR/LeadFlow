const { getBot } = require('./bot');
const { config } = require('./config');

class TelegramService {
  constructor() {
    this.chatId = config.chatId;
  }

  /**
   * Получает экземпляр бота
   */
  getBot() {
    return getBot();
  }

  /**
   * Экранирует HTML-сущности для безопасной отправки в Telegram
   */
  escapeHtml(text) {
    if (!text) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * Форматирует данные заявки в читаемое сообщение
   */
  formatApplicationMessage(application) {
    const statusMap = {
      'new': '🆕 Новая',
      'in_progress': '🔄 В работе',
      'completed': '✅ Завершена',
      'rejected': '❌ Отклонена'
    };

    // Экранируем все пользовательские данные
    const name = this.escapeHtml(application.name);
    const phone = this.escapeHtml(application.phone);
    const email = application.email ? this.escapeHtml(application.email) : null;
    const comment = application.comment ? this.escapeHtml(application.comment) : null;
    const utmSource = application.utm_source ? this.escapeHtml(application.utm_source) : null;
    const utmMedium = application.utm_medium ? this.escapeHtml(application.utm_medium) : null;
    const utmCampaign = application.utm_campaign ? this.escapeHtml(application.utm_campaign) : null;

    let message = `📋 <b>Новая заявка</b>\n\n`;
    message += `👤 <b>Имя:</b> ${name}\n`;
    message += `📞 <b>Телефон:</b> ${phone}\n`;
    
    if (email) {
      message += `📧 <b>Email:</b> ${email}\n`;
    }
    
    if (comment) {
      message += `💬 <b>Комментарий:</b> ${comment}\n`;
    }
    
    message += `📊 <b>Статус:</b> ${statusMap[application.status] || application.status}\n`;
    
    // UTM метки
    if (utmSource || utmMedium || utmCampaign) {
      message += `\n📈 <b>UTM метки:</b>\n`;
      if (utmSource) {
        message += `   • Source: ${utmSource}\n`;
      }
      if (utmMedium) {
        message += `   • Medium: ${utmMedium}\n`;
      }
      if (utmCampaign) {
        message += `   • Campaign: ${utmCampaign}\n`;
      }
    }
    
    message += `\n🆔 <b>ID заявки:</b> ${application.id}\n`;
    message += `🕐 <b>Дата:</b> ${this.escapeHtml(new Date(application.createdAt).toLocaleString('ru-RU'))}`;

    return message;
  }

  /**
   * Отправляет уведомление о новой заявке в Telegram
   */
  async sendApplicationNotification(application) {
    const bot = this.getBot();
    
    if (!bot || !this.chatId) {
      console.warn('Telegram bot не настроен. Пропуск отправки уведомления.');
      return false;
    }

    try {
      const message = this.formatApplicationMessage(application);
      
      await bot.sendMessage(this.chatId, message, {
        parse_mode: 'HTML'
      });
      
      console.log(`✓ Уведомление о заявке #${application.id} отправлено в Telegram`);
      return true;
    } catch (error) {
      // Логируем ошибку, но не прерываем выполнение
      console.error('Ошибка при отправке уведомления в Telegram:', error.message);
      return false;
    }
  }

  /**
   * Проверяет, настроен ли сервис
   */
  isConfigured() {
    const bot = this.getBot();
    return !!(bot && this.chatId);
  }
}

// Экспортируем singleton экземпляр
module.exports = new TelegramService();

